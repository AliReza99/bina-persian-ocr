"""Where each line of the OCR text sits on the page, for /api/v1/ocr line boxes.

A line detector (PP-OCRv5) finds text rows; a cheap reader (Tesseract for Persian, RapidOCR for
English) reads each row roughly, only to tell which OCR line it is. The text itself stays Bina's.
Lines the matcher skips get a guessed box from the lines around them, flagged `guess`.
"""
import collections, csv, io, re, subprocess, threading, unicodedata
from difflib import SequenceMatcher

import cv2
import numpy as np
from rapidocr import LangRec, OCRVersion, RapidOCR

PARAMS = {'Det.ocr_version': OCRVersion.PPOCRV5, 'Det.limit_side_len': 960, 'Det.limit_type': 'max',
          'Det.score_mode': 'slow',  # fast scores a curved line by its bounding rect, mostly background: dropped
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


def owner(polys, c):
    """Index of the box point c belongs to, or None. Boxes of curved lines are tall and overlap
    the next line, so of those containing c take the one whose midline is nearest."""
    def off(p):
        a, b = (p[0] + p[3]) / 2, (p[1] + p[2]) / 2
        u, v = (b - a) / np.linalg.norm(b - a), np.subtract(c, a)
        return abs(u[0] * v[1] - u[1] * v[0])
    return min((k for k, p in enumerate(polys) if cv2.pointPolygonTest(p, c, False) >= 0), key=lambda k: off(polys[k]), default=None)


def first_box(polys, c):
    """Index of the first box containing point c, or None."""
    return next((k for k, p in enumerate(polys) if cv2.pointPolygonTest(p, c, False) >= 0), None)


def tesseract_reads(rgb, polys):
    """Rough Persian text per detected box: the Tesseract words whose centers fall inside it.
    Returns two lists of reads, one per way of sharing words between overlapping boxes."""
    rows = csv.DictReader(io.StringIO(_tesseract(rgb, '-l', 'fas', '--psm', '3', 'tsv')), delimiter='\t', quoting=csv.QUOTE_NONE)
    words = [((int(r['left']) + int(r['width']) / 2, int(r['top']) + int(r['height']) / 2), r['text'])
             for r in rows if r['level'] == '5' and r['text'].strip()]
    alone = {}

    def read_alone(k):  # the page pass skips some blocks; read this one line on its own
        if k not in alone:
            x, y, w, h = cv2.boundingRect(polys[k])
            alone[k] = _tesseract(rgb[max(0, y):y + h, max(0, x):x + w], '-l', 'fas', '--psm', '7').strip()
        return alone[k]

    out = []
    for pick in (owner, first_box):
        reads = [[] for _ in polys]
        for c, w in words:
            k = pick(polys, c)
            if k is not None:
                reads[k].append(w)
        out.append([' '.join(r) if r else read_alone(k) for k, r in enumerate(reads)])
    return out


def center(q):
    return np.mean(q, axis=0)


def match(boxes, keys, per_char, width):
    """Order-keeping pairing of boxes (top to bottom) with lines, like a diff: ({line: box index}, total score).
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
    return placed, best[0, 0]


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


def persian_rows(image):
    """Options of detector boxes with their Tesseract reads, top to bottom; lines() keeps the one fitting the text best.
    Needs no OCR text, so it can run while Bina reads."""
    rgb = np.asarray(image)
    with _lock:
        # detector boxes only (the recognizer would drop low-confidence ones); Tesseract reads them
        res = DETECT(rgb, use_rec=False, use_cls=False)
        if res.boxes is None:
            return []
        polys = sorted(res.boxes.tolist(), key=lambda b: center(b)[1])
        reads = tesseract_reads(rgb, [np.array(b, dtype=np.float32) for b in polys])
        return [list(zip(polys, r)) for r in (reads if reads[0] != reads[1] else reads[:1])]


def lines(image, text, debug=None, rows=None):
    """image: the RGB PIL image that was read; text: its OCR text.
    Returns [{'index': index in text.split('\\n'), 'text': that line, 'box': 4 [x, y] points as fractions of the image, 'guess'}].
    debug: a list to fill with every detector box {'box', 'read', 'used'} (used = matched to a line, not guessed).
    rows: a Future of persian_rows(image) started earlier; used only if the text is Persian."""
    raw = text.split('\n')
    index = [i for i, l in enumerate(raw) if l.strip()]  # back to raw line numbers
    keys = [norm(raw[i]) for i in index]
    if not keys:
        return []
    rtl = sum('؀' <= c <= 'ۿ' for c in text) > len(text) * .3
    if rtl:
        options = rows.result() if rows else persian_rows(image)
    else:
        with _lock:
            res = ENGLISH(np.asarray(image))
        options = [sorted(zip(res.boxes.tolist(), getattr(res, 'txts', None) or [''] * len(res.boxes)), key=lambda b: center(b[0])[1])] if res.boxes is not None else []
    if not options:
        return []
    width = [np.linalg.norm(np.subtract(b[1], b[0])) for b, _ in options[0]]
    per_char = sum(width) / max(1, sum(map(len, keys)))  # page-wide pixels per character
    boxes, placed, _ = max(((b, *match(b, keys, per_char, width)) for b in options), key=lambda o: o[2])
    quad ={j: np.array(boxes[i][0], float) for j, i in placed.items()}
    guessed = fill(quad, set(placed.values()), boxes, keys, per_char, rtl) if quad else {}
    size = np.array(image.size, float)
    frac = lambda q: [[round(float(v), 4) for v in np.clip(p / size, 0, 1)] for p in np.asarray(q, float)]
    if debug is not None:
        used = set(placed.values())
        debug += [{'box': frac(b), 'read': r, 'used': i in used} for i, (b, r) in enumerate(boxes)]
    return [{'index': index[j], 'text': raw[index[j]], 'box': frac(q), 'guess': j in guessed}
            for j, q in sorted({**quad, **guessed}.items())]


FLAGS = ('boxes_off_column', 'rows_no_box', 'box_too_wide', 'replay_in_boxes', 'bad_chars_in_box', 'merged_paragraph', 'no_lines')
BAD_CHARS = re.compile(r'[\u0400-\u052F\u2E80-\uD7FF\uFFFD]|</?[a-zA-Z_][^>]{0,15}>|\|\s*---')  # model junk: CJK, Cyrillic, HTML, markdown tables


def x_span(q):
    return min(p[0] for p in q), max(p[0] for p in q)


def column(rows):
    """(left, right) of the page being read, as fractions: where most detector width sits, so a facing page falls outside it. None under 3 rows."""
    spans = sorted((sum(x_span(q)) / 2, *x_span(q)) for q in rows if x_span(q)[1] - x_span(q)[0] > .02)
    if len(spans) < 3:
        return None
    half, seen = sum(r - l for _, l, r in spans) / 2, 0
    for mid, l, r in spans:
        seen += r - l
        if seen >= half:
            break
    near = [s for s in spans if abs(s[0] - mid) < .22]
    lefts, rights = sorted(s[1] for s in near), sorted(s[2] for s in near)
    return lefts[len(lefts) // 10], rights[-1 - len(rights) // 10]  # 10% in from each side: stray rows don't widen it


def flags(text, lines, rows):
    """Why this page's boxes may deserve a human look, {name in FLAGS: detail}. Heuristics for review only, never change the output.
    lines: from lines(); rows: every detector box, 4 [x, y] fractions."""
    out = {}
    raw = [l['text'] for l in lines]
    keys = collections.Counter(k for k in map(norm, raw) if len(k) >= 8)
    repeated = sum(n - 1 for n in keys.values() if n > 1)
    if repeated >= 2:
        out['replay_in_boxes'] = f'{repeated}/{len(lines)} boxes'
    bad = next(filter(None, map(BAD_CHARS.search, raw)), None)
    if bad:
        out['bad_chars_in_box'] = bad.string[max(bad.start() - 10, 0):bad.end() + 10]
    filled = sorted(map(len, (l for l in text.split('\n') if l.strip())))
    usual = filled[len(filled) // 2] if filled else 0
    merged = sum(len(l) >= 200 or (len(l) >= 110 and len(l) >= 2.2 * usual) for l in raw)  # one box, many rows
    if merged:
        out['merged_paragraph'] = f'{merged} lines'
    col = column(rows)
    if col:
        left, right = col[0] - .02, col[1] + .02
        off = sum(not left <= center(l['box'])[0] <= right for l in lines)
        if off >= 4 and off >= .2 * len(lines):
            out['boxes_off_column'] = f'{off}/{len(lines)} boxes'
        wide = sum(x_span(l['box'])[1] - x_span(l['box'])[0] > 1.2 * (col[1] - col[0]) for l in lines)
        if wide:
            out['box_too_wide'] = f'{wide} boxes'
    long_rows = [q for q in rows if x_span(q)[1] - x_span(q)[0] > .12 and (not col or left <= center(q)[0] <= right)]
    if lines:
        polys = [np.array(l['box'], dtype=np.float32) for l in lines]
        empty = sum(first_box(polys, tuple(map(float, center(q)))) is None for q in long_rows)
        if len(long_rows) >= 8 and empty >= .25 * len(long_rows):
            out['rows_no_box'] = f'{empty}/{len(long_rows)} rows'
    elif len(long_rows) >= 3:
        out['no_lines'] = f'{len(long_rows)} rows'
    return out
