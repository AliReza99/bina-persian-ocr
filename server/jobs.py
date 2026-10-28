"""Admission control (pause, bounded wait) and SQLite job history with thumbnails."""
import pathlib, sqlite3, threading, time

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
        if paused:
            raise Rejected('paused')
        if in_flight > MAX_WAITING:
            raise Rejected('busy')
        in_flight += 1


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
        _db.execute('UPDATE jobs SET seconds=?, incomplete=?, chars=?, error=? WHERE id=?',
                    (seconds, int(bool(result and result['incomplete'])),
                     len(result['text']) if result else None, error, job_id))
        _db.commit()
    _prune()


def _prune():
    with _db_lock:
        old = [r[0] for r in _db.execute(
            'SELECT id FROM jobs WHERE created < ? OR id <= (SELECT MAX(id) FROM jobs) - ?',
            (time.time() - KEEP_DAYS * 86400, KEEP_ROWS))]
        if not old:
            return
        _db.executemany('DELETE FROM jobs WHERE id=?', [(i,) for i in old])
        _db.commit()
    for i in old:
        (THUMBS / f'{i}.jpg').unlink(missing_ok=True)


SORTS = {'recent': 'id DESC', 'slowest': 'seconds DESC NULLS LAST', 'failed': 'error IS NULL, incomplete DESC, id DESC'}


def recent(sort='recent', limit=100):
    with _db_lock:
        return [dict(r) for r in _db.execute(f'SELECT * FROM jobs ORDER BY {SORTS[sort]} LIMIT ?', (limit,))]


def stats():
    day = time.time() - 86400
    with _db_lock:
        secs = [r[0] for r in _db.execute('SELECT seconds FROM jobs WHERE error IS NULL AND seconds IS NOT NULL ORDER BY seconds')]
        row = _db.execute('SELECT COUNT(*), SUM(error IS NOT NULL), SUM(incomplete) FROM jobs WHERE created > ?', (day,)).fetchone()
    return {
        'jobs_24h': row[0], 'errors_24h': row[1] or 0, 'incomplete_24h': row[2] or 0,
        'avg_seconds': round(sum(secs) / len(secs), 2) if secs else None,
        'p95_seconds': secs[min(len(secs) - 1, int(len(secs) * 0.95))] if secs else None,
    }


def state():
    with _state_lock:
        waiting = max(0, in_flight - (1 if running else 0))
        return {'paused': paused, 'running': running, 'waiting': waiting, 'max_waiting': MAX_WAITING}
