"""Bina OCR HTTP server.

Run:   .venv/bin/python server/app.py [--host 127.0.0.1] [--port 8001]
UI:    open http://127.0.0.1:8001/  (admin: /admin, both only from this machine; make client tokens there)
Docs:  http://127.0.0.1:8001/docs (README.md)
API:   curl -H 'Authorization: Bearer <client token>' --data-binary @page.jpg http://127.0.0.1:8001/api/v1/ocr
"""
import argparse, io, json, pathlib, sys, time
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from PIL import Image

import align, jobs, monitor, ocr

VERSION = '0.5'
STATIC = pathlib.Path(__file__).resolve().parent / 'static'
DOCS = pathlib.Path(__file__).resolve().parent.parent / 'README.md'
NOT_FOUND = {'error': 'not found', 'docs': '/docs'}
MAX_BYTES = 30 * 2**20
MAX_EDGE = 2500  # longer images are downscaled before inference
Image.MAX_IMAGE_PIXELS = 50_000_000  # decompression-bomb guard: Pillow raises above 2x this
PUBLIC = {'/health'}
OCR_PATHS = {'/api/v1/ocr', '/api/v1/whoami'}  # need a client token, even from this machine
DOC_PATHS = {'/docs', '/llms.txt'}  # a client token or this machine
# everything else is admin: this machine only, no login
LOCAL_IPS = {'127.0.0.1', '::1', '::ffff:127.0.0.1'}
PAGES = {'/': 'index.html', '/admin': 'admin.html', '/api-docs': 'api-docs.html'}
ASSET_DIRS = ('vendor', 'js', 'css')  # served from static/, admin-guarded like the pages
ASSET_TYPES = {'.js': 'text/javascript', '.css': 'text/css'}
PREP = ThreadPoolExecutor(1)  # box detection + rough reads, on the CPU while Bina reads on the GPU


def gpu_mem():
    free, total = ocr.torch.cuda.mem_get_info()
    return (total - free) // 2**20, total // 2**20


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

    def is_local(self):
        ip = self.client_address[0]
        # bound to one address (e.g. Tailscale), this machine reaches itself from that same address
        return ip in LOCAL_IPS or ip == self.server.server_address[0]

    def same_site(self):
        """Not a browser sent here by another website: DNS rebinding changes Host, a cross-site POST sets Origin."""
        host = self.headers.get('Host', '')
        origin = self.headers.get('Origin')
        return (host.rsplit(':', 1)[0] in ('127.0.0.1', 'localhost', self.server.server_address[0])
                and (not origin or origin.split('://', 1)[-1] == host))

    def guard(self, path):
        """True if the request may proceed; otherwise the rejection is already sent. Sets self.who."""
        given = self.headers.get('Authorization', '').removeprefix('Bearer ')
        self.who = (given and jobs.token_client(given, self.client_address[0])) or None
        if path in PUBLIC or (path in OCR_PATHS and self.who):
            return True
        if path not in OCR_PATHS and ((self.is_local() and self.same_site()) or (path in DOC_PATHS and self.who)):
            return True
        if path in OCR_PATHS or path in DOC_PATHS:
            self.reply(401, {'error': 'missing or wrong token'})
        else:
            self.reply(403, {'error': 'admin is only reachable from the Bina machine'})
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
        if path == '/api/v1/whoami':  # lets a client check its token without sending a page
            return self.reply(200, {'name': self.who, 'paused': jobs.token_paused(self.who)})
        asset = (STATIC / path[1:]).resolve()
        if path.split('/')[1] in ASSET_DIRS and asset.is_relative_to(STATIC) and asset.suffix in ASSET_TYPES and asset.is_file():
            # vendor files never change; our own code must not go stale after an edit
            cache = 'max-age=86400' if path.startswith('/vendor/') else 'no-cache'
            return self.send(200, asset.read_bytes(), ASSET_TYPES[asset.suffix], [('Cache-Control', cache)])
        if path == '/api/admin/state':
            return self.reply(200, {**jobs.state(), 'version': VERSION, 'device': ocr.device,
                                    'uptime': round(time.time() - monitor.started), 'samples': monitor.poll(gpu_mem if ocr.device == 'cuda' else None)})
        q = {k: v[0] for k, v in parse_qs(url.query).items()}
        if path == '/api/admin/series':
            if q.get('range', '24h') not in jobs.RANGES:
                return self.reply(400, {'error': f'range must be one of {list(jobs.RANGES)}'})
            return self.reply(200, jobs.series(q.get('range', '24h')))
        if path == '/api/admin/jobs':
            sort, status = q.get('sort', 'recent'), q.get('status', '')
            if sort not in jobs.SORTS or status not in jobs.STATUSES:
                return self.reply(400, {'error': f'sort must be one of {list(jobs.SORTS)}, status one of {list(jobs.STATUSES)}'})
            try:
                job_id = int(q['id']) if q.get('id') else None
                offset, limit = max(0, int(q.get('offset', 0))), min(200, max(1, int(q.get('limit', 50))))
            except ValueError:
                return self.reply(400, {'error': 'id, offset and limit must be integers'})
            rows, total, clients = jobs.recent(sort, status, q.get('client', ''), job_id, offset, limit)
            return self.reply(200, {'jobs': rows, 'total': total, 'clients': clients})
        if path == '/api/admin/tokens':
            return self.reply(200, {'tokens': jobs.tokens()})
        job_id = path.removeprefix('/api/admin/text/')
        if job_id != path and job_id.isdigit():
            return self.reply(200, {'text': jobs.text(int(job_id))})
        job_id = path.removeprefix('/api/admin/thumb/')
        if job_id != path and job_id.isdigit() and (jobs.THUMBS / f'{job_id}.jpg').exists():
            return self.send(200, (jobs.THUMBS / f'{job_id}.jpg').read_bytes(), 'image/jpeg')
        self.reply(404, NOT_FOUND)

    def do_POST(self):
        url = urlparse(self.path)
        if not self.guard(url.path):
            return
        if url.path in ('/api/admin/pause', '/api/admin/resume'):
            jobs.set_paused(url.path == '/api/admin/pause')
            return self.reply(200, jobs.state())
        if url.path == '/api/admin/limit':
            _, raw = self.body(4096)
            try:
                value = json.loads(raw or b'{}').get('max_seconds')
            except (ValueError, AttributeError):
                value = 'bad'
            lo, hi = jobs.MAX_SECONDS_RANGE
            if value is not None and not (type(value) is int and lo <= value <= hi):
                return self.reply(400, {'error': f'send {{"max_seconds": n}}, n whole seconds {lo} to {hi}, or null for no limit'})
            jobs.set_max_seconds(value)
            return self.reply(200, jobs.state())
        if url.path == '/api/admin/tokens':
            _, raw = self.body(4096)
            try:
                name = str(json.loads(raw or b'{}').get('name', '')).strip()
            except (ValueError, AttributeError):
                name = ''
            if not 0 < len(name) <= 60:
                return self.reply(400, {'error': 'send {"name": "..."}, 1 to 60 characters'})
            try:
                return self.reply(201, {'name': name, 'token': jobs.create_token(name)})
            except ValueError as e:
                return self.reply(409, {'error': str(e)})
        token_id, _, action = url.path.removeprefix('/api/admin/tokens/').partition('/')
        if action == 'revoke' and token_id.isdigit():
            jobs.revoke_token(int(token_id))
            return self.reply(200, {'revoked': True})
        if action in ('pause', 'resume') and token_id.isdigit():
            jobs.set_token_paused(int(token_id), action == 'pause')
            return self.reply(200, {'paused': action == 'pause'})
        if url.path == '/api/admin/clear':
            jobs.clear()
            return self.reply(200, {'cleared': True})
        if url.path == '/api/v1/ocr':
            return self.ocr(url)
        if url.path == '/api/admin/ocr':  # the test page on /, from this machine
            self.who = 'test page'
            return self.ocr(url, debug=True)
        self.reply(404, NOT_FOUND)

    def ocr(self, url, debug=False):
        q = {k: v[0] for k, v in parse_qs(url.query).items()}
        masked = q.get('masked', '0')
        if masked not in ('0', '1'):
            return self.reply(400, {'error': 'masked must be 0 or 1'})
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
            jobs.admit(self.who)
        except jobs.Rejected as e:
            return self.reply(503, {'error': str(e)}, [('Retry-After', '30' if str(e) == 'paused' else '5')])
        try:
            self.run_job(image, size, debug, masked == '1')
        finally:
            jobs.release()

    def run_job(self, image, size, debug=False, masked=False):
        ip = self.client_address[0]
        client = self.who  # the token's name: a client can't relabel itself
        job_id = jobs.start(client, ip, image, size)
        tick = [time.monotonic()]
        rows = PREP.submit(align.persian_rows, image)  # guesses Persian; English redoes it after

        def on_start():
            tick[0] = time.monotonic()  # time inference only, not the wait for the model
            jobs.set_running({'id': job_id, 'client': client, 'started': time.time()})

        try:
            result = ocr.transcribe(image, on_start, jobs.max_seconds, masked)
        except Exception as e:
            jobs.finish(job_id, round(time.monotonic() - tick[0], 2), error=repr(e))
            return self.reply(500, {'error': repr(e)})
        finally:
            jobs.set_running(None)
        seconds = round(time.monotonic() - tick[0], 2)
        jobs.finish(job_id, seconds, result)
        extra = {}
        # matching needs the text, so it runs after the model lock is released
        started = time.monotonic()
        try:
            detector = [] if debug else None  # the test page also gets every detector box, to see misses
            extra['lines'] = align.lines(image, result['text'], detector, rows)
            if debug:
                extra['detector'] = detector
        except Exception as e:  # boxes are extra: never fail a page that was read
            print(f'align failed on job {job_id}: {e!r}', file=sys.stderr, flush=True)
            extra['lines'] = []
        extra['align_seconds'] = round(time.monotonic() - started, 2)
        self.reply(200, {**result, 'seconds': seconds, **extra})


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--host', default='127.0.0.1')
    p.add_argument('--port', type=int, default=8001)
    a = p.parse_args()
    print(f'Bina OCR {VERSION} on {ocr.device}, listening on http://{a.host}:{a.port}', flush=True)
    ThreadingHTTPServer((a.host, a.port), Handler).serve_forever()
