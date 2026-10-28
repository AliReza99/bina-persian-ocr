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
./run.sh            # --host 0.0.0.0 --port 8001
```

UI: http://127.0.0.1:8001/

## API

### `POST /ocr`

Extract the text (Persian/English) from one image. Requests are processed one at a time.

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
| 413 | body over 30 MB |
| 500 | inference failed |

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

`200 {"status": "ok", "device": "cuda", "docs": "/docs"}` (`device` is `cuda` or `cpu`).

### `GET /docs`, `GET /llms.txt`

This API section, as `text/markdown`. Unknown paths return `404 {"error": "not found", "docs": "/docs"}`.

### `GET /`

Web UI.

No auth: keep the default `127.0.0.1` unless the network is trusted.
