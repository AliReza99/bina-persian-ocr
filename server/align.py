"""Where each line of the OCR text sits on the page, for /v2/ocr.

A line detector (PP-OCRv5) finds text rows; a cheap reader (Tesseract for Persian, RapidOCR for
English) reads each row roughly, only to tell which OCR line it is. The text itself stays Bina's.
Lines the matcher skips get a guessed box from the lines around them, flagged `guess`.
"""
import csv, io, re, subprocess, threading, unicodedata
from difflib import SequenceMatcher

import cv2
import numpy as np
from rapidocr import LangRec, OCRVersion, RapidOCR

PARAMS = {'Det.ocr_version': OCRVersion.PPOCRV5, 'Det.limit_side_len': 960, 'Det.limit_type': 'max',
          'Rec.ocr_version': OCRVersion.PPOCRV4, 'Global.log_level': 'error', 'Global.text_score': 0}
DETECT = RapidOCR(params=PARAMS)  # separate instance: use_rec=False sticks to the engine it is passed to
ENGLISH = RapidOCR(params={**PARAMS, 'Rec.lang_type': LangRec.EN})
MIN_CHARS = 4      # shorter rough reads match too many lines
MIN_SCORE = .6     # a box and a line pair up only above this
_lock = threading.Lock()  # one aligner run at a time; it is CPU-bound and short

FOLD = str.maketrans('يكىۀةأإآ۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩', 'یکیههااا01234567890123456789')


def norm(s):
    s = unicodedata.normalize('NFKC', s).translate(FOLD).lower()
    return re.sub(r'[\W_ً-ٰٟ]+', '', s)  # drop spaces, punctuation, ZWNJ, harakat


def best_window(r, line):
    """How well rough read r matches some stretch of line, 0..1."""
    if len(line) <= len(r):
        return SequenceMatcher(None, r, line, autojunk=False).ratio()
    step = max(1, len(r) // 4)
    return max(SequenceMatcher(None, r, line[i:i + len(r)], autojunk=False).ratio()
               for i in range(0, len(line) - len(r) + step, step))


def _tesseract(rgb, *args):
    ok, png = cv2.imencode('.png', cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
    return subprocess.run(['tesseract', '-', '-', *args], input=png.tobytes(), capture_output=True, timeout=60).stdout.decode()


def tesseract_reads(rgb, polys):
    """Rough Persian text per detected box: the Tesseract words whose centers fall inside it."""
    rows = csv.DictReader(io.StringIO(_tesseract(rgb, '-l', 'fas', '--psm', '3', 'tsv')), delimiter='\t', quoting=csv.QUOTE_NONE)
    words = [((int(r['left']) + int(r['width']) / 2, int(r['top']) + int(r['height']) / 2), r['text'])
             for r in rows if r['level'] == '5' and r['text'].strip()]
    reads = [[] for _ in polys]
    for c, w in words:
        for k, p in enumerate(polys):
            if cv2.pointPolygonTest(p, c, False) >= 0:
                reads[k].append(w)
                break
    out = []
    for p, r in zip(polys, reads):
        if not r:  # the page pass skips some blocks; read this one line on its own
            x, y, w, h = cv2.boundingRect(p)
            r = [_tesseract(rgb[max(0, y):y + h, max(0, x):x + w], '-l', 'fas', '--psm', '7').strip()]
        out.append(' '.join(r))
    return out


def center(q):
    return np.mean(q, axis=0)


def match(boxes, keys, per_char, width):
    """Order-keeping pairing of boxes (top to bottom) with lines, like a diff: {line: box index}.
    A pair scores on rough-read similarity and on box width vs line length; skips cost nothing."""
    def score(i, j):
        k = keys[j]
        if not k:
            return -1
        est = width[i] / per_char
        size = 1 - abs(est - len(k)) / max(est, len(k))
        r = norm(boxes[i][1])
        sim = best_window(r, k) if len(r) >= MIN_CHARS else 0
        return .8 * sim + .2 * size - MIN_SCORE

    n, m = len(boxes), len(keys)
    best = np.zeros((n + 1, m + 1))
    move = np.zeros((n + 1, m + 1), dtype=int)
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            opts = [best[i + 1, j], best[i, j + 1], score(i, j) + best[i + 1, j + 1]]
            move[i, j] = int(np.argmax(opts))
            best[i, j] = opts[move[i, j]]
    placed, i, j = {}, 0, 0
    while i < n and j < m:
        if move[i, j] == 0:
            i += 1
        elif move[i, j] == 1:
            j += 1
        else:
            if score(i, j) > 0:
                placed[j] = i
            i += 1
            j += 1
    return placed


def leftover_rows(boxes, idx):
    """Unused detector boxes, merged when they sit on one row (the detector splits lines at gaps)."""
    rows = []
    for i in sorted(idx, key=lambda i: center(boxes[i][0])[1]):
        q = np.array(boxes[i][0], float)
        if rows and abs(center(q)[1] - center(rows[-1])[1]) < np.linalg.norm(q[3] - q[0]) / 2:
            pts = np.vstack([rows[-1], q])
            (x0, y0), (x1, y1) = pts.min(0), pts.max(0)
            rows[-1] = np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
        else:
            rows.append(q)
    return rows


def fill(quad, used, boxes, keys, per_char, rtl):
    """Guess boxes for lines the matcher skipped, using the placed lines around them as anchors:
    snap to a leftover detector row, else interpolate between the two anchors. Returns {line: quad}."""
    steps = [center(quad[j + 1])[1] - center(quad[j])[1] for j in quad if j + 1 in quad]
    if not steps:
        return {}
    pitch = np.median(steps)
    xs = np.vstack(list(quad.values()))[:, 0]
    # leftover boxes outside the placed text column are the facing page or the background
    rows = leftover_rows(boxes, [i for i in range(len(boxes)) if i not in used and xs.min() <= center(boxes[i][0])[0] <= xs.max()])
    guessed = {}

    def fits(j, q):  # box width vs line length, like the matcher's size term
        est, w = len(keys[j]) * per_char, np.linalg.norm(q[1] - q[0])
        return bool(keys[j]) and 1 - abs(est - w) / max(est, w) >= .5

    def put(j, q, between):
        est, w = len(keys[j]) * per_char, np.linalg.norm(q[1] - q[0])
        if between and est < .8 * w:  # short line, likely a paragraph end: keep the reading-start side
            f, q = est / w, q.copy()
            if rtl:
                q[0], q[3] = q[1] + (q[0] - q[1]) * f, q[2] + (q[3] - q[2]) * f
            else:
                q[1], q[2] = q[0] + (q[1] - q[0]) * f, q[3] + (q[2] - q[3]) * f
        guessed[j] = q

    js = sorted(quad)
    for a, b in zip(js, js[1:]):
        n = b - a - 1
        if not n:
            continue
        ya, yb = center(quad[a])[1], center(quad[b])[1]
        inside = [k for k, r in enumerate(rows) if ya < center(r)[1] < yb]
        if abs((yb - ya) / (n + 1) - pitch) < .35 * pitch:  # gap holds exactly these lines
            for t in range(1, n + 1):
                q = quad[a] + (quad[b] - quad[a]) * t / (n + 1)
                k = min(inside, key=lambda k: abs(center(rows[k])[1] - center(q)[1]), default=None)
                if k is not None and abs(center(rows[k])[1] - center(q)[1]) < pitch / 2:
                    inside.remove(k)
                    put(a + t, rows[k], False)
                else:
                    put(a + t, q, True)
        elif len(inside) == n:  # gap has extra space (heading, paragraph break) but the rows count matches
            for t, k in enumerate(inside, 1):
                put(a + t, rows[k], False)

    # before the first and after the last anchor: only real leftover rows, in order, when the width fits
    for run, below in ((range(js[-1] + 1, len(keys)), True), (range(js[0] - 1, -1, -1), False)):
        y = center(quad[js[-1] if below else js[0]])[1]
        side = sorted((r for r in rows if (center(r)[1] > y) == below), key=lambda r: center(r)[1], reverse=not below)
        for j in run:
            if not side:
                break
            if fits(j, side[0]):  # else this OCR line is junk (a fragment), keep the row for the next one
                put(j, side.pop(0), False)
    return guessed


def lines(image, text):
    """image: the RGB PIL image that was read; text: its OCR text.
    Returns [{'line': index in text.split('\\n'), 'box': 4 [x, y] points as fractions of the image, 'guess'}]."""
    index = [i for i, l in enumerate(text.split('\n')) if l.strip()]  # back to raw line numbers
    keys = [norm(text.split('\n')[i]) for i in index]
    if not keys:
        return []
    rgb = np.asarray(image)
    rtl = sum('؀' <= c <= 'ۿ' for c in text) > len(text) * .3
    with _lock:
        # Persian: detector boxes only (the recognizer would drop low-confidence ones); Tesseract reads them
        res = DETECT(rgb, use_rec=False, use_cls=False) if rtl else ENGLISH(rgb)
        if res.boxes is None:
            return []
        reads = getattr(res, 'txts', None) or [''] * len(res.boxes)
        boxes = sorted(zip(res.boxes.tolist(), reads), key=lambda b: center(b[0])[1])
        if rtl:
            boxes = list(zip([b for b, _ in boxes], tesseract_reads(rgb, [np.array(b, dtype=np.float32) for b, _ in boxes])))
    width = [np.linalg.norm(np.subtract(b[1], b[0])) for b, _ in boxes]
    per_char = sum(width) / max(1, sum(map(len, keys)))  # page-wide pixels per character
    placed = match(boxes, keys, per_char, width)
    quad = {j: np.array(boxes[i][0], float) for j, i in placed.items()}
    guessed = fill(quad, set(placed.values()), boxes, keys, per_char, rtl) if quad else {}
    size = np.array(image.size, float)
    return [{'line': index[j], 'box': [[round(float(v), 4) for v in np.clip(p / size, 0, 1)] for p in q], 'guess': j in guessed}
            for j, q in sorted({**quad, **guessed}.items())]
