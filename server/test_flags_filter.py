"""Self-check for the jobs flag filter, on a throwaway copy of the database: .venv/bin/python server/test_flags_filter.py"""
import pathlib, shutil, sys, tempfile

from PIL import Image

copy = pathlib.Path(tempfile.mkdtemp()) / 'server'
copy.mkdir()
shutil.copy(pathlib.Path(__file__).with_name('jobs.py'), copy)
sys.path.insert(0, str(copy))
import jobs

assert pathlib.Path(jobs.__file__).parent == copy, 'would touch the real database'

image = Image.new('RGB', (10, 10))
done, flagged, unread = (jobs.start('c', 'ip', image, 1) for _ in range(3))
for job in (done, flagged):
    jobs.finish(job, 1, {'text': 't', 'incomplete': False})
jobs.set_lines(done, [], {})
box = [{'index': 0, 'box': [[0, 0], [1, 0], [1, 1], [0, 1]], 'guess': False}]
jobs.set_lines(flagged, box, {'no_lines': '3 rows'})


def ids(flag):
    return {j['id'] for j in jobs.recent(flag=flag)[0]}


assert ids('') == {done, flagged, unread}, 'no filter hid a job'
assert ids('any') == {flagged} and ids('no_lines') == {flagged}, 'flag filter wrong'
assert ids('rows_no_box') == set(), 'other flag matched'
rows = {j['id']: j for j in jobs.recent()[0]}
assert rows[flagged]['flags'] == {'no_lines': '3 rows'} and rows[unread]['flags'] == {}, 'flags not parsed'
assert 'lines' not in rows[flagged], 'lines belong in the per-job read'
assert jobs.lines(flagged) == box and jobs.lines(unread) == [] and jobs.lines(999) == [], 'lines read wrong'
print('ok')
