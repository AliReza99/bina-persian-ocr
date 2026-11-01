"""Self-check for the loop detector in model/decoding.py (no model needed): .venv/bin/python server/test_decoding.py"""
import pathlib, random, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / 'model'))
from decoding import tail_loop

random.seed(0)
text = [random.randrange(70000) for _ in range(400)]
assert not tail_loop(text), 'plain text flagged'
assert not tail_loop([5, 6, 7] * 40), 'fires before a full window'
assert tail_loop(text + [11, 12] * 80), 'period-2 loop missed'
assert tail_loop(text + [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32] * 14), 'period-12 loop missed'
assert tail_loop(text + ([11, 12] * 7 + [13]) * 11), 'loop with a rare stray token missed'
assert not tail_loop([11, 12] * 80 + text), 'old loop followed by text still flagged'
print('ok')
