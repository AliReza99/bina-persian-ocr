"""Bina OCR HTTP server.

Run:   .venv/bin/python server/app.py [--host 127.0.0.1] [--port 8001]
UI:    open http://127.0.0.1:8001/
Docs:  http://127.0.0.1:8001/docs (README.md)
API:   curl --data-binary @page.jpg http://127.0.0.1:8001/ocr            -> {"text": ...}
       curl --data-binary @page.jpg 'http://127.0.0.1:8001/ocr?task=markup'
"""
import argparse, io, json, pathlib, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from PIL import Image

import ocr

INDEX = pathlib.Path(__file__).resolve().parent / 'static' / 'index.html'
DOCS = pathlib.Path(__file__).resolve().parent.parent / 'README.md'
NOT_FOUND = {'error': 'not found', 'docs': '/docs'}
MAX_BYTES = 30 * 2**20


class Handler(BaseHTTPRequestHandler):
    def send(self, code, body, content_type):
        self.send_response(code)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def reply(self, code, obj):
        self.send(code, json.dumps(obj, ensure_ascii=False).encode(), 'application/json; charset=utf-8')

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/':
            return self.send(200, INDEX.read_bytes(), 'text/html; charset=utf-8')
        if path in ('/docs', '/llms.txt'):
            # only the README's API section: clients need usage, not setup or model details
            api = DOCS.read_text().split('\n## API\n', 1)[-1]
            return self.send(200, ('# OCR service API\n' + api).encode(), 'text/markdown; charset=utf-8')
        if path == '/health':
            return self.reply(200, {'status': 'ok', 'device': ocr.device, 'docs': '/docs'})
        self.reply(404, NOT_FOUND)

    def do_POST(self):
        url = urlparse(self.path)
        if url.path != '/ocr':
            return self.reply(404, NOT_FOUND)
        task = parse_qs(url.query).get('task', ['ocr'])[0]
        if task not in ocr.PROMPTS:
            return self.reply(400, {'error': f'task must be one of {list(ocr.PROMPTS)}'})
        size = int(self.headers.get('Content-Length') or 0)
        if not 0 < size <= MAX_BYTES:
            return self.reply(413 if size else 400, {'error': f'send image bytes as body, max {MAX_BYTES} bytes'})
        try:
            image = Image.open(io.BytesIO(self.rfile.read(size))).convert('RGB')
        except Exception:
            return self.reply(400, {'error': 'body is not a readable image'})
        tick = time.monotonic()
        try:
            result = ocr.transcribe(image, task)
        except Exception as e:
            return self.reply(500, {'error': repr(e)})
        self.reply(200, {**result, 'seconds': round(time.monotonic() - tick, 2)})


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--host', default='127.0.0.1')
    p.add_argument('--port', type=int, default=8001)
    a = p.parse_args()
    print(f'Bina OCR on {ocr.device}, listening on http://{a.host}:{a.port}', flush=True)
    ThreadingHTTPServer((a.host, a.port), Handler).serve_forever()
