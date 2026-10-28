# Bina OCR server

Local HTTP server + web UI for [Reza2kn/Bina-0.4-Koochik](https://huggingface.co/Reza2kn/Bina-0.4-Koochik) (Persian/English OCR), full model on GPU (BF16) or CPU.

```
model/          model code + configs from HF (weights downloaded)
server/ocr.py   model loading + transcription (splits regions that loop)
server/app.py   HTTP server
server/static/  web UI
samples/        test images and outputs
.venv/          Python 3.11 env (not in git)
```

## Model

Only the weights (`model/model.safetensors`, 2.4 GB, BF16) are not in git. They come from [Reza2kn/Bina-0.4-Koochik](https://huggingface.co/Reza2kn/Bina-0.4-Koochik), based on [nvidia/Nemotron-3.5-Parse](https://huggingface.co/nvidia/Nemotron-3.5-Parse).

## Setup (once)

```sh
git clone https://github.com/AliReza99/bina-persian-ocr && cd bina-persian-ocr
uv venv -p 3.11 .venv
uv pip install -p .venv huggingface_hub -r model/requirements.txt
.venv/bin/hf download Reza2kn/Bina-0.4-Koochik model.safetensors --local-dir model
```

## Run

```sh
./run.sh                                       # 127.0.0.1:8001, auth off
OCR_TOKEN=secret ./run.sh --host 100.x.y.z     # Tailscale IP; token required off localhost
```

UI: http://127.0.0.1:8001/ , admin (queue, pause, job history): /admin

Run as a service on boot: see `deploy/bina-ocr.service`. Job history and thumbnails live in `data/` (30 days / 5000 jobs).

## API

### `POST /ocr`

Extract the text (Persian/English) from one image. One image runs at a time; up to 3 more wait, beyond that the server answers `503 busy`.

**Auth**: when the server has `OCR_TOKEN` set, send `Authorization: Bearer <token>` (all routes except `/health`, `/login`). Optional `X-Client: <name>` labels the job in the admin history.

Images with a long edge over 2500 px are downscaled first; over 100 MP are rejected.

**Query**

| Param | Values | Default | Meaning |
|---|---|---|---|
| `task` | `ocr`, `markup` | `ocr` | `ocr` = plain text, `markup` = Markdown/math |

**Body**: raw image bytes (PNG, JPG, WebP, anything Pillow reads), max 30 MB. No multipart, no JSON. `Content-Type` is ignored.

**Response 200** `application/json`

```json
{
  "text": "این یک متن آزمایشی است.\n123 + 456 = 579",
  "incomplete": false,
  "seconds": 0.36
}
```

| Field | Type | Meaning |
|---|---|---|
| `text` | string | transcript, lines separated by `\n` |
| `incomplete` | bool | `true` if some region still hit a repetition loop after splitting; part of the text may be missing |
| `seconds` | number | inference time |

**Errors** (all `{"error": "<message>"}`)

| Status | When |
|---|---|
| 400 | empty body, unreadable image, or bad `task` |
| 404 | unknown path |
| 401 | missing or wrong token |
| 413 | body over 30 MB, or image over 100 MP |
| 500 | inference failed |
| 503 | `{"error": "busy"}` queue full, or `{"error": "paused"}` paused by admin; see `Retry-After` |

**Examples**

```sh
curl --data-binary @page.jpg http://127.0.0.1:8001/ocr
curl --data-binary @page.jpg 'http://127.0.0.1:8001/ocr?task=markup'
```

```python
import requests
r = requests.post('http://127.0.0.1:8001/ocr', data=open('page.jpg', 'rb'))
print(r.json()['text'])
```

```js
const r = await fetch('http://127.0.0.1:8001/ocr', { method: 'POST', body: file }); // file: Blob/File/Buffer
const { text } = await r.json();
```

### `GET /health`

`200 {"status": "ok", "device": "cuda", "version": "0.5", "busy": false, "waiting": 0, "docs": "/docs"}`. `status` is `ok` or `paused`, `device` is `cuda` or `cpu`. No auth.

### Admin

`GET /admin/state` (paused, running job, waiting, 24h stats, GPU memory), `GET /admin/jobs?sort=recent|slowest|failed`, `GET /admin/thumb/<id>`, `POST /admin/pause`, `POST /admin/resume`. Same auth.

### `GET /docs`, `GET /llms.txt`

This API section, as `text/markdown`. Unknown paths return `404 {"error": "not found", "docs": "/docs"}`.

### `GET /`

Web UI.

Web UI (login with the token when `OCR_TOKEN` is set).
