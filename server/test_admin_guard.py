"""Self-check that other websites can't reach admin (no model, throwaway database): .venv/bin/python server/test_admin_guard.py"""
import http.client, pathlib, shutil, sys, tempfile, threading, types
from http.server import ThreadingHTTPServer

server = pathlib.Path(__file__).resolve().parent
copy = pathlib.Path(tempfile.mkdtemp()) / 'server'
copy.mkdir()
shutil.copy(server / 'jobs.py', copy)
sys.path.insert(0, str(copy))
sys.modules['align'] = types.ModuleType('align')
sys.modules['ocr'] = types.SimpleNamespace(device='cpu')
import app, jobs

assert pathlib.Path(jobs.__file__).parent == copy, 'would touch the real database'

http_server = ThreadingHTTPServer(('127.0.0.1', 0), app.Handler)
threading.Thread(target=http_server.serve_forever, daemon=True).start()
port = http_server.server_address[1]
ok_host = f'127.0.0.1:{port}'


def status(method, path, host=ok_host, origin=None):
    c = http.client.HTTPConnection('127.0.0.1', port)
    c.request(method, path, headers={'Host': host, **({'Origin': origin} if origin else {})})
    return c.getresponse().status


assert status('GET', '/api/admin/tokens') == 200, 'admin refused from this machine'
assert status('GET', '/api/admin/tokens', f'localhost:{port}') == 200, 'an ssh tunnel arrives as localhost'
assert status('GET', '/api/admin/tokens', f'evil.example:{port}') == 403, 'DNS rebinding reads admin'
assert status('GET', '/admin', 'localhost.evil.example') == 403, 'lookalike host got in'
assert status('GET', '/health', 'evil.example') == 200, '/health is public'

assert status('POST', '/api/admin/pause', origin='http://evil.example') == 403, 'cross-site POST got in'
assert status('POST', '/api/admin/pause', origin='null') == 403, 'sandboxed page POST got in'
assert status('POST', '/api/admin/pause', origin=f'http://localhost:{port}') == 403, 'another local site got in'
assert jobs.paused is False, 'a refused POST still paused'
assert status('POST', '/api/admin/pause', origin=f'http://{ok_host}') == 200, 'the admin page itself refused'
assert jobs.paused is True
assert status('POST', '/api/admin/resume') == 200, 'curl (no Origin) refused'
print('ok')
