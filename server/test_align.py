"""Self-check for align.py on the sample page (no model needed): .venv/bin/python server/test_align.py"""
import json, pathlib
from concurrent.futures import Future

import numpy as np
from PIL import Image

import align

SAMPLES = pathlib.Path(__file__).resolve().parent.parent / 'samples'

text = json.loads((SAMPLES / 'out.json').read_text())['ocr_prediction']
raw = text.split('\n')
lines = align.lines(Image.open(SAMPLES / 'img.jpg').convert('RGB'), text)

assert lines, 'no line got a box'
assert all(0 <= l['index'] < len(raw) and raw[l['index']].strip() for l in lines), 'line index off'
assert all(l['text'] == raw[l['index']] for l in lines), 'line text off'
assert [l['index'] for l in lines] == sorted({l['index'] for l in lines}), 'lines out of order or repeated'
assert all(len(l['box']) == 4 and all(0 <= v <= 1 for p in l['box'] for v in p) for l in lines), 'box not 4 points in 0..1'
tops = [min(p[1] for p in l['box']) for l in lines if not l['guess']]
assert tops == sorted(tops), 'matched boxes not top to bottom'
real = sum(1 for l in raw if len(align.norm(l)) >= align.MIN_CHARS)
assert len(lines) >= .7 * real, f'only {len(lines)}/{real} lines placed'
assert align.lines(Image.new('RGB', (100, 100), 'white'), '') == []
tall, low = (np.array(q, dtype=np.float32) for q in ([[0, 0], [100, 0], [100, 60], [0, 60]], [[0, 40], [100, 40], [100, 80], [0, 80]]))
assert align.owner([tall, low], (50, 44)) == 0 and align.owner([tall, low], (50, 58)) == 1, 'word not given to nearest midline'
assert align.owner([tall, low], (50, 200)) is None, 'word outside every box got an owner'
assert align.first_box([tall, low], (50, 58)) == 0, 'first box not taken'
one, two = 'سلام دنیای خوب ما', 'امروز هوا خیلی عالی است'
quads = [[[0, 0], [100, 0], [100, 20], [0, 20]], [[0, 30], [100, 30], [100, 50], [0, 50]]]
worse, better = [list(zip(quads, r)) for r in ([two, one], [one, two])]
rows = Future()
rows.set_result([worse, better])
picked = align.lines(Image.new('RGB', (100, 60), 'white'), f'{one}\n{two}', None, rows)
assert [(l['index'], l['guess']) for l in picked] == [(0, False), (1, False)], 'did not keep the option fitting the text best'
row = lambda y, x0=.2, x1=.8: [[x0, y], [x1, y], [x1, y + .02], [x0, y + .02]]
page = [row(.1 + i * .04) for i in range(12)]
boxed = lambda n: [{'index': i, 'text': f'خط شماره {i} از این صفحه کتاب', 'box': page[i], 'guess': False} for i in range(n)]
sane = '\n'.join(l['text'] for l in boxed(12))
assert align.flags(sane, boxed(12), page) == {}, 'clean page flagged'
assert set(align.flags('\n'.join(l['text'] for l in boxed(6)), boxed(6), page)) == {'rows_no_box'}, 'half the rows without boxes not flagged'
facing = [{'index': i, 'text': f'تکه {i} از صفحه روبرو', 'box': row(.1 + i * .04, .85, .98), 'guess': False} for i in range(5)]
assert 'boxes_off_column' in align.flags(sane, boxed(12) + facing, page), 'boxes on the facing page not flagged'
twice = boxed(12) + [{**l, 'index': l['index'] + 12} for l in boxed(3)]
assert align.flags(sane, twice, page)['replay_in_boxes'] == '3/15 boxes', 'replay not flagged'
assert 'bad_chars_in_box' in align.flags(sane, [{**boxed(1)[0], 'text': 'خط <table>'}], page), 'junk not flagged'
assert 'merged_paragraph' in align.flags(sane, [{**boxed(1)[0], 'text': 'ک' * 200}], page), 'merged paragraph not flagged'
assert 'box_too_wide' in align.flags(sane, [{**boxed(1)[0], 'box': row(.1, 0, 1)}], page), 'wide box not flagged'
assert set(align.flags('تصویر', [], page)) == {'no_lines'} and align.flags('', [], []) == {}, 'no lines not flagged'
print(f'ok: {len(lines)}/{real} lines placed, {sum(l["guess"] for l in lines)} guessed')
