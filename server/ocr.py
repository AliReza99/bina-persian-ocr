"""Bina 0.4 Koochik inference: loads the model once and transcribes PIL images."""
import copy, pathlib, sys, threading

import numpy as np
import torch

MODEL_DIR = pathlib.Path(__file__).resolve().parent.parent / 'model'
sys.path.insert(0, str(MODEL_DIR))
from transformers import AutoModel, AutoProcessor, GenerationConfig
from layout_regions import regions
from decoding import generate_repaired

PROMPTS = {'ocr': '</s><s><predict_text_in_pic>', 'markup': '</s><s><output_markdown><predict_text_in_pic>'}
MIN_SPLIT_HEIGHT = 48  # below this a region is about one line; stop splitting

device = 'cuda' if torch.cuda.is_available() else 'cpu'
dtype = torch.bfloat16 if device == 'cuda' else torch.float32
model = AutoModel.from_pretrained(MODEL_DIR, trust_remote_code=True, local_files_only=True, dtype=dtype).eval().to(device)
processor = AutoProcessor.from_pretrained(MODEL_DIR, trust_remote_code=True, local_files_only=True)
config = GenerationConfig.from_pretrained(MODEL_DIR, local_files_only=True)
config.max_new_tokens = 2048
torch.set_grad_enabled(False)
_lock = threading.Lock()  # one model instance: serialize inference


def _whitest_row(crop):
    """Row in the middle half with the least ink, so a split falls between text lines."""
    ink = (np.asarray(crop.convert('L')) < 128).sum(axis=1)
    h = len(ink)
    return h // 4 + int(np.argmin(ink[h // 4: 3 * h // 4]))


def _ocr_region(image, prompt, flagged):
    selected = generate_repaired(model, processor, image, prompt, copy.deepcopy(config))['selected']
    looped = selected['capped'] or selected['signal']['flagged']
    if looped and image.height >= 2 * MIN_SPLIT_HEIGHT:
        # model fell into a repetition loop: shorter pieces avoid it
        y = _whitest_row(image)
        return '\n'.join(t for t in (_ocr_region(image.crop((0, 0, image.width, y)), prompt, flagged),
                                     _ocr_region(image.crop((0, y, image.width, image.height)), prompt, flagged)) if t)
    if looped:
        flagged.append(True)
    return selected['ocr_prediction']


def transcribe(image, task='ocr'):
    """image: RGB PIL image. Returns {'text', 'incomplete'}."""
    flagged = []
    with _lock:
        texts = [_ocr_region(image.crop(tuple(r['bbox'])), PROMPTS[task], flagged) for r in regions(image)['regions']]
    return {'text': '\n'.join(t for t in texts if t), 'incomplete': bool(flagged)}
