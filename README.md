# Bina OCR server

Local HTTP server + web UI for [Reza2kn/Bina-0.4-Koochik](https://huggingface.co/Reza2kn/Bina-0.4-Koochik) (Persian/English OCR), full model on GPU (BF16) or CPU.

```
model/          HF model snapshot (code in git, weights downloaded)
server/ocr.py   model loading + transcription (splits regions that loop)
server/app.py   HTTP server
server/static/  web UI for the server
webui/          in-browser WebGPU INT4 app (HF Space snapshot)
samples/        test images and outputs
.venv/          Python 3.11 env (not in git)
```

## Where the models come from

Weights are not in git (too big). All from Hugging Face:

| Path | Source |
|---|---|
| `model/` (`model.safetensors`, full BF16) | model [Reza2kn/Bina-0.4-Koochik](https://huggingface.co/Reza2kn/Bina-0.4-Koochik) |
| `webui/` (ONNX INT4 in `webui/model/shared-models/`, `position-field.npy`) | Space [Reza2kn/Bina-0.4-Koochik](https://huggingface.co/spaces/Reza2kn/Bina-0.4-Koochik) |

Related: [ONNX-WebGPU-INT4](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-ONNX-WebGPU-INT4), base model [nvidia/Nemotron-3.5-Parse](https://huggingface.co/nvidia/Nemotron-3.5-Parse).

## Setup (once)

```sh
git clone https://github.com/AliReza99/bina-0.4-koochik && cd bina-0.4-koochik
uv venv -p 3.11 .venv
uv pip install -p .venv huggingface_hub -r model/requirements.txt
.venv/bin/hf download Reza2kn/Bina-0.4-Koochik --local-dir model
.venv/bin/hf download Reza2kn/Bina-0.4-Koochik --repo-type space --local-dir webui   # only for webui/
```

The downloads restore the missing weights. Matching files already in git are overwritten with upstream copies, so run `git diff` afterwards if you changed them.

## In-browser app (`webui/`)

Static site, no Python needed. Serve the folder and open it in a WebGPU browser (recent Chrome/Edge):

```sh
cd webui && python3 -m http.server 8080   # http://127.0.0.1:8080/
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
