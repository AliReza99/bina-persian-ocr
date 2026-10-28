"""Admission control (pause, bounded wait) and SQLite job history with thumbnails."""
import collections, pathlib, sqlite3, threading, time

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
if 'text' not in [c[1] for c in _db.execute('PRAGMA table_info(jobs)')]:  # added after the first release
    _db.execute('ALTER TABLE jobs ADD COLUMN text TEXT')
_db.commit()
_db_lock = threading.Lock()

_state_lock = threading.Lock()
paused = False
in_flight = 0  # running + waiting
running = None  # {'id', 'client', 'started'} of the job holding the model


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


def set_running(job):
    global running
    running = job


def start(client, task, image, size):
    """Record a job row and its thumbnail; returns the job id."""
    with _db_lock:
        cur = _db.execute('INSERT INTO jobs (created, client, task, width, height, bytes) VALUES (?,?,?,?,?,?)',
                          (time.time(), client, task, image.width, image.height, size))
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


def recent(sort='recent', status='', client='', task='', job_id=None, offset=0, limit=50):
    """One page of jobs matching the filters, and the total match count. sort and status must be keys of SORTS, STATUSES."""
    where = [STATUSES[status]]
    args = []
    for col, val in (('client', client), ('task', task), ('id', job_id)):
        if val not in ('', None):
            where.append(f'{col} = ?')
            args.append(val)
    where = ' AND '.join(where)
    with _db_lock:
        total = _db.execute(f'SELECT COUNT(*) FROM jobs WHERE {where}', args).fetchone()[0]
        rows = _db.execute(f'SELECT * FROM jobs WHERE {where} ORDER BY {SORTS[sort]} LIMIT ? OFFSET ?', (*args, limit, offset))
        return [{k: r[k] for k in r.keys() if k != 'text'} for r in rows], total  # text is fetched per job by text()


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
    """Per-bucket counts and latency over the range, plus scatter points and client/task splits."""
    span, step = RANGES[span_name]
    now = time.time()
    first = (now - span) // step * step + step
    with _db_lock:
        rows = _db.execute('SELECT created, client, task, width, height, seconds, incomplete, error FROM jobs WHERE created >= ?', (first,)).fetchall()
        rejects = _db.execute("SELECT created FROM rejects WHERE reason = 'busy' AND created >= ?", (first,)).fetchall()
    n = int((now - first) // step) + 1
    b = {k: [0] * n for k in ('ok', 'incomplete', 'error', 'rejected')}
    secs = [[] for _ in range(n)]
    clients, tasks, scatter = collections.Counter(), collections.Counter(), []
    for r in rows:
        i = int((r['created'] - first) // step)
        clients[r['client']] += 1
        tasks[r['task']] += 1
        if r['error']:
            b['error'][i] += 1
        elif r['seconds'] is not None:
            b['incomplete' if r['incomplete'] else 'ok'][i] += 1
            secs[i].append(r['seconds'])
            scatter.append((round(r['width'] * r['height'] / 1e6, 2), r['seconds']))
    for (created,) in rejects:
        b['rejected'][int((created - first) // step)] += 1
    return {'t': [first + i * step for i in range(n)], **b,
            'avg': [round(sum(s) / len(s), 2) if s else None for s in secs], 'p95': [_p95(s) for s in secs],
            'scatter': sorted(scatter), 'clients': clients.most_common(), 'tasks': tasks.most_common()}


def clear():
    with _db_lock:
        _db.execute('DELETE FROM jobs')
        _db.execute('DELETE FROM rejects')
        _db.commit()
    for p in THUMBS.glob('*.jpg'):
        p.unlink(missing_ok=True)


def stats():
    day = time.time() - 86400
    with _db_lock:
        secs = [r[0] for r in _db.execute('SELECT seconds FROM jobs WHERE error IS NULL AND seconds IS NOT NULL AND created > ?', (day,))]
        row = _db.execute('SELECT COUNT(*), SUM(error IS NOT NULL), SUM(incomplete), SUM(seconds IS NOT NULL OR error IS NOT NULL) FROM jobs WHERE created > ?', (day,)).fetchone()
        busy = _db.execute("SELECT COUNT(*) FROM rejects WHERE reason = 'busy' AND created > ?", (day,)).fetchone()[0]
    done, errors, incomplete = row[3] or 0, row[1] or 0, row[2] or 0
    return {
        'jobs_24h': row[0], 'errors_24h': errors, 'incomplete_24h': incomplete, 'busy_24h': busy,
        'success_pct': round((done - errors - incomplete) / done * 100, 1) if done else None,
        'avg_seconds': round(sum(secs) / len(secs), 2) if secs else None, 'p95_seconds': _p95(secs),
    }


def state():
    with _state_lock:
        waiting = max(0, in_flight - (1 if running else 0))
        return {'paused': paused, 'running': running, 'waiting': waiting, 'max_waiting': MAX_WAITING}
