"""Self-check for align.py on the sample page (no model needed): .venv/bin/python server/test_align.py"""
import json, pathlib

from PIL import Image

import align

SAMPLES = pathlib.Path(__file__).resolve().parent.parent / 'samples'

text = json.loads((SAMPLES / 'out.json').read_text())['ocr_prediction']
raw = text.split('\n')
lines = align.lines(Image.open(SAMPLES / 'img.jpg').convert('RGB'), text)

assert lines, 'no line got a box'
assert all(0 <= l['line'] < len(raw) and raw[l['line']].strip() for l in lines), 'line index off'
assert [l['line'] for l in lines] == sorted({l['line'] for l in lines}), 'lines out of order or repeated'
assert all(len(l['box']) == 4 and all(0 <= v <= 1 for p in l['box'] for v in p) for l in lines), 'box not 4 points in 0..1'
tops = [min(p[1] for p in l['box']) for l in lines if not l['guess']]
assert tops == sorted(tops), 'matched boxes not top to bottom'
real = sum(1 for l in raw if len(align.norm(l)) >= align.MIN_CHARS)
assert len(lines) >= .7 * real, f'only {len(lines)}/{real} lines placed'
assert align.lines(Image.new('RGB', (100, 100), 'white'), '') == []
print(f'ok: {len(lines)}/{real} lines placed, {sum(l["guess"] for l in lines)} guessed')
