"""Bina 0.4 Koochik inference: loads the model once and transcribes PIL images."""
import copy, pathlib, sys, threading, time

import numpy as np
import torch
from PIL import ImageOps

MODEL_DIR = pathlib.Path(__file__).resolve().parent.parent / 'model'
sys.path.insert(0, str(MODEL_DIR))
from transformers import AutoModel, AutoProcessor, GenerationConfig
from layout_regions import regions
from decoding import generate_repaired

PROMPT = '</s><s><predict_text_in_pic>'
MIN_SPLIT_HEIGHT = 48  # below this a region is about one line; stop splitting

device = 'cuda' if torch.cuda.is_available() else 'cpu'
dtype = torch.bfloat16 if device == 'cuda' else torch.float32
model = AutoModel.from_pretrained(MODEL_DIR, trust_remote_code=True, local_files_only=True, dtype=dtype).eval().to(device)
processor = AutoProcessor.from_pretrained(MODEL_DIR, trust_remote_code=True, local_files_only=True)
config = GenerationConfig.from_pretrained(MODEL_DIR, local_files_only=True)
config.max_new_tokens = 4096  # a dense Persian page needs ~2.5-4k; loops are cut early by decoding.LoopStop
torch.set_grad_enabled(False)
_lock = threading.Lock()  # one model instance: serialize inference


class _Looped(Exception):
    pass


def _whitest_row(crop):
    """Row in the middle half with the least ink, so a split falls between text lines."""
    ink = (np.asarray(crop.convert('L')) < 128).sum(axis=1)
    h = len(ink)
    return h // 4 + int(np.argmin(ink[h // 4: 3 * h // 4]))


def _ocr_region(image, prompt, flagged, deadline, bail=False):
    left = deadline and deadline - time.monotonic()
    if left is not None and left <= 0:
        flagged.append(True)  # out of time: the rest of the image is skipped
        return ''
    cfg = copy.deepcopy(config)
    cfg.max_time = left  # None: no limit
    selected = generate_repaired(model, processor, image, prompt, cfg)['selected']
    looped = selected['capped'] or selected['signal']['flagged']
    # cut off by the time limit, or a loop with too little time left to reread the halves: keep what was read
    if deadline and deadline - time.monotonic() < 1 and (looped or not selected['ended_with_eos']):
        flagged.append(True)
        return selected['ocr_prediction']
    if looped and bail:
        raise _Looped
    if looped and image.height >= 2 * MIN_SPLIT_HEIGHT:
        # model fell into a repetition loop: shorter pieces avoid it
        y = _whitest_row(image)
        return '\n'.join(t for t in (_ocr_region(image.crop((0, 0, image.width, y)), prompt, flagged, deadline),
                                     _ocr_region(image.crop((0, y, image.width, image.height)), prompt, flagged, deadline)) if t)
    if looped:
        flagged.append(True)
    return selected['ocr_prediction']


def _ocr_page(image, flagged, deadline, texts, bail=False):
    for r in regions(image)['regions']:
        texts.append(_ocr_region(image.crop(tuple(r['bbox'])), PROMPT, flagged, deadline, bail))


def transcribe(image, on_start=None, max_seconds=None, masked=False):
    """image: RGB PIL image. Returns {'text', 'incomplete'}. on_start runs once the model is ours.
    max_seconds caps inference (not the wait for the model); past it the text so far comes back as incomplete.
    masked: the old masked decoding, ~1.75x slower; text can differ on hard pages, better or worse."""
    flagged = []
    with _lock:
        model.decoder.unmasked_decode = not masked
        if on_start:
            on_start()
        deadline = max_seconds and time.monotonic() + max_seconds
        texts = first = []
        try:
            _ocr_page(image, flagged, deadline, first, bail=True)
        except _Looped:
            # faint show-through from the page's back can make Bina loop; faded to white it often reads.
            # only after a loop: on pages that read fine the contrast change can make Bina invent lines
            flagged.clear()
            texts = []
            _ocr_page(ImageOps.autocontrast(image.convert('L'), cutoff=2).convert('RGB'), flagged, deadline, texts)
            # cut short by the time limit or another loop: keep whichever read got further
            if flagged and len(''.join(first)) > len(''.join(texts)):
                texts = first
    return {'text': '\n'.join(t for t in texts if t), 'incomplete': bool(flagged)}
