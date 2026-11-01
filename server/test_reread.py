"""Self-check for the contrast reread after a loop (model stubbed): .venv/bin/python server/test_reread.py"""
import sys, time, types

from PIL import Image

model = types.SimpleNamespace(decoder=types.SimpleNamespace(), eval=lambda: model, to=lambda d: model)
loader = types.SimpleNamespace(from_pretrained=lambda *a, **k: model)
sys.modules['torch'] = types.SimpleNamespace(cuda=types.SimpleNamespace(is_available=lambda: False), float32=None, bfloat16=None, set_grad_enabled=lambda v: None)
sys.modules['transformers'] = types.SimpleNamespace(AutoModel=loader, AutoProcessor=loader, GenerationConfig=loader)
sys.modules['layout_regions'] = types.SimpleNamespace(regions=lambda im: {'regions': [{'bbox': (0, i * 25, 100, i * 25 + 25)} for i in range(4)]})
calls = [0]


def attempt(text, looped=False, eos=True):
    return {'selected': {'capped': False, 'signal': {'flagged': looped}, 'ended_with_eos': eos, 'ocr_prediction': text}}


def generate(model, proc, image, prompt, cfg):
    calls[0] += 1
    if calls[0] <= 4:  # first pass: three regions read, the fourth loops with time still left
        time.sleep(slow)
        return attempt(f'first{calls[0]}', looped=calls[0] == 4)
    if cfg.max_time:  # reread: runs out of the time that's left
        time.sleep(cfg.max_time)
        return attempt('cut', eos=False)
    return attempt(f'reread{calls[0]}')


sys.modules['decoding'] = types.SimpleNamespace(generate_repaired=generate)
import ocr

page = Image.new('RGB', (100, 100), 'white')

slow = .3
out = ocr.transcribe(page, None, 3)
assert out == {'text': 'first1\nfirst2\nfirst3', 'incomplete': True}, f'reread threw away what was read: {out}'

slow, calls[0] = 0, 0
out = ocr.transcribe(page)
assert out == {'text': 'reread5\nreread6\nreread7\nreread8', 'incomplete': False}, f'finished reread not used: {out}'
print('ok')
