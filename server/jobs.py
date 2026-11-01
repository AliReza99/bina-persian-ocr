"""Admission control (pause, bounded wait), SQLite job history with thumbnails, and client tokens."""
import collections, hashlib, pathlib, secrets, sqlite3, threading, time

DATA = pathlib.Path(__file__).resolve().parent.parent / 'data'
THUMBS = DATA / 'thumbs'
MAX_WAITING = 3  # requests queued behind the running one; more get 503 busy
KEEP_DAYS, KEEP_ROWS = 30, 5000
THUMB_EDGE = 480

THUMBS.mkdir(parents=True, exist_ok=True)
_db = sqlite3.connect(DATA / 'jobs.db', check_same_thread=False)
_db.row_factory = sqlite3.Row
_db.execute('''CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY, created REAL, client TEXT, task TEXT, width INTEGER, height INTEGER,
  bytes INTEGER, seconds REAL, incomplete INTEGER, chars INTEGER, error TEXT)''')
_db.execute('CREATE TABLE IF NOT EXISTS rejects (created REAL, reason TEXT)')
_cols = [c[1] for c in _db.execute('PRAGMA table_info(jobs)')]
if 'text' not in _cols:  # added after the first release
    _db.execute('ALTER TABLE jobs ADD COLUMN text TEXT')
if 'ip' not in _cols:  # added with client tokens
    _db.execute('ALTER TABLE jobs ADD COLUMN ip TEXT')
# Only a hash is kept: a token is shown once, when it's made.
_db.execute('''CREATE TABLE IF NOT EXISTS tokens (
  id INTEGER PRIMARY KEY, name TEXT UNIQUE, hash TEXT UNIQUE, created REAL, last_used REAL, last_ip TEXT)''')
_db.execute('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value)')
_db.commit()
_db_lock = threading.Lock()

_state_lock = threading.Lock()
paused = False
in_flight = 0  # running + waiting
running = None  # {'id', 'client', 'started'} of the job holding the model
MAX_SECONDS_RANGE = (5, 3600)
_row = _db.execute("SELECT value FROM settings WHERE key='max_seconds'").fetchone()
max_seconds = _row and _row[0]  # inference time limit per job; None: no limit


class Rejected(Exception):
    pass


def admit():
    """Reserve a slot or raise Rejected('paused' | 'busy'). Pair with release()."""
    global in_flight
    with _state_lock:
        reason = 'paused' if paused else 'busy' if in_flight > MAX_WAITING else None
        if not reason:
            in_flight += 1
            return
    with _db_lock:
        _db.execute('INSERT INTO rejects VALUES (?,?)', (time.time(), reason))
        _db.commit()
    raise Rejected(reason)


def release():
    global in_flight
    with _state_lock:
        in_flight -= 1


def set_paused(value):
    global paused
    paused = value


def set_max_seconds(value):
    """value: whole seconds in MAX_SECONDS_RANGE, or None for no limit. Kept across restarts."""
    global max_seconds
    with _db_lock:
        _db.execute("INSERT OR REPLACE INTO settings VALUES ('max_seconds', ?)", (value,))
        _db.commit()
    max_seconds = value


def set_running(job):
    global running
    running = job


def start(client, ip, image, size):
    """Record a job row and its thumbnail; returns the job id."""
    with _db_lock:
        cur = _db.execute('INSERT INTO jobs (created, client, ip, width, height, bytes) VALUES (?,?,?,?,?,?)',
                          (time.time(), client, ip, image.width, image.height, size))
        _db.commit()
        job_id = cur.lastrowid
    thumb = image.copy()
    thumb.thumbnail((THUMB_EDGE, THUMB_EDGE))
    thumb.save(THUMBS / f'{job_id}.jpg', quality=80)
    return job_id


def finish(job_id, seconds, result=None, error=None):
    with _db_lock:
        _db.execute('UPDATE jobs SET seconds=?, incomplete=?, chars=?, text=?, error=? WHERE id=?',
                    (seconds, int(bool(result and result['incomplete'])),
                     len(result['text']) if result else None, result and result['text'], error, job_id))
        _db.commit()
    _prune()


def _prune():
    with _db_lock:
        old = [r[0] for r in _db.execute(
            'SELECT id FROM jobs WHERE created < ? OR id <= (SELECT MAX(id) FROM jobs) - ?',
            (time.time() - KEEP_DAYS * 86400, KEEP_ROWS))]
        _db.execute('DELETE FROM rejects WHERE created < ?', (time.time() - KEEP_DAYS * 86400,))
        _db.commit()
        if not old:
            return
        _db.executemany('DELETE FROM jobs WHERE id=?', [(i,) for i in old])
        _db.commit()
    for i in old:
        (THUMBS / f'{i}.jpg').unlink(missing_ok=True)


SORTS = {'recent': 'id DESC', 'slowest': 'seconds DESC NULLS LAST', 'failed': 'error IS NULL, incomplete DESC, id DESC'}


STATUSES = {'': '1', 'ok': 'error IS NULL AND seconds IS NOT NULL AND NOT incomplete', 'incomplete': 'incomplete',
            'error': 'error IS NOT NULL', 'running': 'seconds IS NULL AND error IS NULL'}


def recent(sort='recent', status='', client='', job_id=None, offset=0, limit=50):
    """One page of jobs matching the filters, the total match count, and every client in history. sort and status must be keys of SORTS, STATUSES."""
    where = [STATUSES[status]]
    args = []
    for col, val in (('client', client), ('id', job_id)):
        if val not in ('', None):
            where.append(f'{col} = ?')
            args.append(val)
    where = ' AND '.join(where)
    with _db_lock:
        total = _db.execute(f'SELECT COUNT(*) FROM jobs WHERE {where}', args).fetchone()[0]
        rows = _db.execute(f'SELECT * FROM jobs WHERE {where} ORDER BY {SORTS[sort]} LIMIT ? OFFSET ?', (*args, limit, offset))
        clients = [r[0] for r in _db.execute('SELECT DISTINCT client FROM jobs ORDER BY client')]
        return [{k: r[k] for k in r.keys() if k != 'text'} for r in rows], total, clients  # text is fetched per job by text()


def text(job_id):
    """OCR text of one job, or None if it has none (failed, running, or recorded before text was kept)."""
    with _db_lock:
        row = _db.execute('SELECT text FROM jobs WHERE id = ?', (job_id,)).fetchone()
    return row and row[0]


def _p95(secs):
    secs = sorted(secs)
    return secs[min(len(secs) - 1, int(len(secs) * 0.95))] if secs else None


RANGES = {'1h': (3600, 60), '24h': (86400, 3600), '7d': (7 * 86400, 6 * 3600)}  # span, bucket seconds


def series(span_name):
    """Per-bucket counts and latency over the range, totals for the whole range, and client split."""
    span, step = RANGES[span_name]
    now = time.time()
    first = (now - span) // step * step + step
    with _db_lock:
        rows = _db.execute('SELECT created, client, seconds, incomplete, error FROM jobs WHERE created >= ?', (first,)).fetchall()
        rejects = _db.execute("SELECT created FROM rejects WHERE reason = 'busy' AND created >= ?", (first,)).fetchall()
    n = int((now - first) // step) + 1
    b = {k: [0] * n for k in ('ok', 'incomplete', 'error', 'rejected')}
    secs = [[] for _ in range(n)]
    clients = collections.Counter()
    for r in rows:
        i = int((r['created'] - first) // step)
        clients[r['client']] += 1
        if r['error']:
            b['error'][i] += 1
        elif r['seconds'] is not None:
            b['incomplete' if r['incomplete'] else 'ok'][i] += 1
            secs[i].append(r['seconds'])
    for (created,) in rejects:
        b['rejected'][int((created - first) // step)] += 1
    every = [x for s in secs for x in s]
    totals = {k: sum(v) for k, v in b.items()} | {'jobs': len(rows),
              'avg': round(sum(every) / len(every), 2) if every else None, 'p95': _p95(every)}
    return {'t': [first + i * step for i in range(n)], **b,
            'avg': [round(sum(s) / len(s), 2) if s else None for s in secs], 'p95': [_p95(s) for s in secs],
            'totals': totals, 'clients': clients.most_common()}


def clear():
    with _db_lock:
        _db.execute('DELETE FROM jobs')
        _db.execute('DELETE FROM rejects')
        _db.commit()
    for p in THUMBS.glob('*.jpg'):
        p.unlink(missing_ok=True)



def state():
    with _state_lock:
        waiting = max(0, in_flight - (1 if running else 0))
        return {'paused': paused, 'running': running, 'waiting': waiting, 'max_waiting': MAX_WAITING,
                'max_seconds': max_seconds}


def _hash(token):
    return hashlib.sha256(token.encode()).hexdigest()  # tokens are random 256-bit, so no salt or slow hash needed


def create_token(name):
    """New client token named `name`; returns it in plain, the only time it's available. Raises ValueError if the name is taken."""
    token = 'bina_' + secrets.token_urlsafe(32)
    with _db_lock:
        try:
            _db.execute('INSERT INTO tokens (name, hash, created) VALUES (?,?,?)', (name, _hash(token), time.time()))
        except sqlite3.IntegrityError:
            raise ValueError(f'a token named {name!r} already exists')
        _db.commit()
    return token


def token_client(token, ip):
    """Name of the client token `token`, noting this use; None if no such token."""
    with _db_lock:
        row = _db.execute('SELECT id, name FROM tokens WHERE hash = ?', (_hash(token),)).fetchone()
        if not row:
            return None
        _db.execute('UPDATE tokens SET last_used = ?, last_ip = ? WHERE id = ?', (time.time(), ip, row['id']))
        _db.commit()
    return row['name']


def tokens():
    with _db_lock:
        return [dict(r) for r in _db.execute('SELECT id, name, created, last_used, last_ip FROM tokens ORDER BY id')]


def revoke_token(token_id):
    with _db_lock:
        _db.execute('DELETE FROM tokens WHERE id = ?', (token_id,))
        _db.commit()
