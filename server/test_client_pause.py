"""Self-check for per-client pause, on a throwaway copy of the database: .venv/bin/python server/test_client_pause.py"""
import pathlib, shutil, sys, tempfile

copy = pathlib.Path(tempfile.mkdtemp()) / 'server'
copy.mkdir()
shutil.copy(pathlib.Path(__file__).with_name('jobs.py'), copy)
sys.path.insert(0, str(copy))
import jobs

assert pathlib.Path(jobs.__file__).parent == copy, 'would touch the real database'


def rejected(client):
    try:
        jobs.admit(client)
    except jobs.Rejected as e:
        return str(e)
    jobs.release()


jobs.create_token('app')
jobs.create_token('benchmark')
app = next(t['id'] for t in jobs.tokens() if t['name'] == 'app')

jobs.set_token_paused(app, True)
assert rejected('app') == 'paused', 'paused client got in'
assert jobs.token_paused('app') is True, 'whoami would miss the pause'
assert jobs.token_paused('benchmark') is False, 'whoami would report another client as paused'
assert jobs.token_paused(None) is False, 'no token counts as paused'
assert rejected('benchmark') is None, 'pausing one client stopped another'
assert rejected(None) is None, 'pausing a client stopped the Playground'
assert jobs.in_flight == 0, 'a rejected request kept its slot'

jobs.set_token_paused(app, False)
assert rejected('app') is None, 'resumed client still paused'

jobs.set_paused(True)
assert rejected('benchmark') == 'paused', 'global pause let a client in'
print('ok')
