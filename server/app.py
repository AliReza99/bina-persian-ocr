"""Bina OCR HTTP server.

Run:   OCR_TOKEN=secret .venv/bin/python server/app.py [--host 127.0.0.1] [--port 8001]
UI:    open http://127.0.0.1:8001/  (admin: /admin)
Docs:  http://127.0.0.1:8001/docs (README.md)
API:   curl -H 'Authorization: Bearer secret' --data-binary @page.jpg http://127.0.0.1:8001/ocr
"""
import argparse, hmac, io, json, os, pathlib, sys, time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from PIL import Image

import jobs, ocr

VERSION = '0.5'
STATIC = pathlib.Path(__file__).resolve().parent / 'static'
DOCS = pathlib.Path(__file__).resolve().parent.parent / 'README.md'
NOT_FOUND = {'error': 'not found', 'docs': '/docs'}
MAX_BYTES = 30 * 2**20
MAX_EDGE = 2500  # longer images are downscaled before inference
Image.MAX_IMAGE_PIXELS = 50_000_000  # decompression-bomb guard: Pillow raises above 2x this
TOKEN = os.environ.get('OCR_TOKEN', '')
PUBLIC = {'/health', '/login'}
PAGES = {'/': 'index.html', '/admin': 'admin.html', '/login': 'login.html'}


class Handler(BaseHTTPRequestHandler):
    def send(self, code, body, content_type, headers=()):
        self.send_response(code)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        for k, v in headers:
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def reply(self, code, obj, headers=()):
        self.send(code, json.dumps(obj, ensure_ascii=False).encode(), 'application/json; charset=utf-8', headers)

    def redirect(self, to, headers=()):
        self.send(303, b'', 'text/plain', [('Location', to), *headers])

    def authed(self):
        if not TOKEN:
            return True
        given = self.headers.get('Authorization', '').removeprefix('Bearer ')
        if not given:
            morsel = SimpleCookie(self.headers.get('Cookie', '')).get('ocr_token')
            given = morsel.value if morsel else ''
        return hmac.compare_digest(given.encode(), TOKEN.encode())

    def guard(self, path):
        """True if the request may proceed; otherwise the rejection is already sent."""
        if path in PUBLIC or self.authed():
            return True
        if path in PAGES:
            self.redirect('/login')
        else:
            self.reply(401, {'error': 'missing or wrong token'})
        return False

    def body(self, limit):
        size = int(self.headers.get('Content-Length') or 0)
        return size, (self.rfile.read(size) if 0 < size <= limit else None)

    def do_GET(self):
        url = urlparse(self.path)
        path = url.path
        if not self.guard(path):
            return
        if path in PAGES:
            return self.send(200, (STATIC / PAGES[path]).read_bytes(), 'text/html; charset=utf-8')
        if path in ('/docs', '/llms.txt'):
            # only the README's API section: clients need usage, not setup or model details
            api = DOCS.read_text().split('\n## API\n', 1)[-1]
            return self.send(200, ('# OCR service API\n' + api).encode(), 'text/markdown; charset=utf-8')
        if path == '/health':
            s = jobs.state()
            return self.reply(200, {'status': 'paused' if s['paused'] else 'ok', 'device': ocr.device,
                                    'version': VERSION, 'busy': s['running'] is not None,
                                    'waiting': s['waiting'], 'docs': '/docs'})
        if path == '/admin/state':
            gpu = None
            if ocr.device == 'cuda':
                free, total = ocr.torch.cuda.mem_get_info()
                gpu = {'used_mb': (total - free) // 2**20, 'total_mb': total // 2**20}
            return self.reply(200, {**jobs.state(), 'stats': jobs.stats(), 'gpu': gpu, 'version': VERSION})
        if path == '/admin/jobs':
            sort = parse_qs(url.query).get('sort', ['recent'])[0]
            if sort not in jobs.SORTS:
                return self.reply(400, {'error': f'sort must be one of {list(jobs.SORTS)}'})
            return self.reply(200, {'jobs': jobs.recent(sort)})
        job_id = path.removeprefix('/admin/thumb/')
        if job_id != path and job_id.isdigit() and (jobs.THUMBS / f'{job_id}.jpg').exists():
            return self.send(200, (jobs.THUMBS / f'{job_id}.jpg').read_bytes(), 'image/jpeg')
        self.reply(404, NOT_FOUND)

    def do_POST(self):
        url = urlparse(self.path)
        if not self.guard(url.path):
            return
        if url.path == '/login':
            _, raw = self.body(4096)
            given = parse_qs((raw or b'').decode()).get('token', [''])[0]
            if not TOKEN or not hmac.compare_digest(given.encode(), TOKEN.encode()):
                return self.redirect('/login?wrong=1' if TOKEN else '/admin')
            cookie = f'ocr_token={given}; HttpOnly; SameSite=Strict; Path=/; Max-Age={90 * 86400}'
            return self.redirect('/admin', [('Set-Cookie', cookie)])
        if url.path in ('/admin/pause', '/admin/resume'):
            jobs.set_paused(url.path == '/admin/pause')
            return self.reply(200, jobs.state())
        if url.path == '/ocr':
            return self.ocr(url)
        self.reply(404, NOT_FOUND)

    def ocr(self, url):
        task = parse_qs(url.query).get('task', ['ocr'])[0]
        if task not in ocr.PROMPTS:
            return self.reply(400, {'error': f'task must be one of {list(ocr.PROMPTS)}'})
        size, raw = self.body(MAX_BYTES)
        if raw is None:
            return self.reply(413 if size else 400, {'error': f'send image bytes as body, max {MAX_BYTES} bytes'})
        try:
            image = Image.open(io.BytesIO(raw))
            image.load()
            image = image.convert('RGB')
        except Image.DecompressionBombError:
            return self.reply(413, {'error': f'image over {2 * Image.MAX_IMAGE_PIXELS} pixels'})
        except Exception:
            return self.reply(400, {'error': 'body is not a readable image'})
        if max(image.size) > MAX_EDGE:
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        try:
            jobs.admit()
        except jobs.Rejected as e:
            return self.reply(503, {'error': str(e)}, [('Retry-After', '30' if str(e) == 'paused' else '5')])
        try:
            self.run_job(task, image, size)
        finally:
            jobs.release()

    def run_job(self, task, image, size):
        client = self.headers.get('X-Client') or self.client_address[0]
        job_id = jobs.start(client, task, image, size)
        tick = [time.monotonic()]

        def on_start():
            tick[0] = time.monotonic()  # time inference only, not the wait for the model
            jobs.set_running({'id': job_id, 'client': client, 'started': time.time()})

        try:
            result = ocr.transcribe(image, task, on_start)
        except Exception as e:
            jobs.finish(job_id, round(time.monotonic() - tick[0], 2), error=repr(e))
            return self.reply(500, {'error': repr(e)})
        finally:
            jobs.set_running(None)
        seconds = round(time.monotonic() - tick[0], 2)
        jobs.finish(job_id, seconds, result)
        self.reply(200, {**result, 'seconds': seconds})


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--host', default='127.0.0.1')
    p.add_argument('--port', type=int, default=8001)
    a = p.parse_args()
    if not TOKEN and a.host not in ('127.0.0.1', 'localhost', '::1'):
        sys.exit('OCR_TOKEN must be set when listening beyond localhost')
    print(f'Bina OCR {VERSION} on {ocr.device}, listening on http://{a.host}:{a.port}'
          + ('' if TOKEN else ' (no OCR_TOKEN: auth off)'), flush=True)
    ThreadingHTTPServer((a.host, a.port), Handler).serve_forever()
