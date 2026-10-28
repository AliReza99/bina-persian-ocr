---
title: Bina 0.4 Koochik
emoji: 👁️
colorFrom: red
colorTo: yellow
sdk: static
app_file: app.html
fullWidth: true
header: default
license: openmdw-1.1
short_description: Persian OCR on your device with INT4 WebGPU
models:
- Reza2kn/Bina-0.4-Koochik
- Reza2kn/Bina-0.4-Koochik-ONNX-WebGPU-INT4
language:
- fa
- en
custom_headers:
  cross-origin-opener-policy: same-origin-allow-popups
tags:
- ocr
- persian
- webgpu
- int4
- onnxruntime-web
- browser-local
---
# Bina 0.4 Koochik in your browser

A Persian-first, browser-local demo of [Bina 0.4 Koochik](https://huggingface.co/Reza2kn/Bina-0.4-Koochik), checkpoint **18,404**, using the separately released [WebGPU INT4 package](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-ONNX-WebGPU-INT4/tree/6c61dd2439286b88637deca030ca3b79aa47534f). The original architecture, weights, custom runtime arithmetic and decoding are preserved. Main training is untouched.

## Try it

Use current Chrome or Edge on a computer with WebGPU. Choose a PNG, JPG or WebP, or use the included newly authored Persian/arithmetic demo. Click **خواندن متن در مرورگر**. About **770 MB** is downloaded on first use; latency and memory requirements depend on the device. Four model sessions stay loaded for subsequent images while the page is open. Stop cancels decoding while preserving already loaded sessions; cancelling initial loading terminates that incomplete worker. The advanced section can release model memory.

Images, generated text and edits remain in the browser. There is no upload, inference server, telemetry, account requirement, or opt-in dataset collection. Hugging Face serves the app/model/font files. The app uses only same-origin static GET requests; selecting a file does not send it to the host. The original PersianVLM site's server-processing API is not used.

PNG inputs with 8-bit depth retain their bytes. JPG, WebP and other PNG bit depths are converted locally to 8-bit PNG without resizing; this conversion is additional browser input support, not a new corpus qualification. Limits: 25 MiB and 20 million pixels per image. PDF is not supported by this demo. Extracted text can be edited, copied or downloaded. The raw JSON preserves the original model output, the legacy GPU diagnostic counter, token IDs and resident-session diagnostics separately from edits. Caps/repetition flags remain visible. The legacy per-device dispatch counter can remain zero with this runtime and is not a success/failure gate; actual GPU qualification is recorded separately for the unchanged engine.

The embedded and standalone views use WebGPU. WASM helper threads follow browser isolation support; ORT may use one helper thread when SharedArrayBuffer is unavailable. If the embedded view lacks GPU access, open the standalone link shown in the app. There is no silent unqualified WASM/CPU route. Browsers without working WebGPU show a compatibility message.

## Progress indicators

The model-download percentage measures streamed decoded response-body bytes against a pinned size manifest, including weights, tokenizer/configuration, positions, startup fixtures and the WASM binary. Page/module JavaScript is outside this counter. Browser-cache reads count as file bytes received, not internet traffic. Progress pauses while components compile; 100% received does not imply GPU initialization is finished. Warm requests keep the existing model and do not download it again.

Inference progress is explicitly **estimated**: it advances from observed vision/neck/prefill stages and token counts, weighted by each region's pixel area. Final transcript length is unknown before EOS. Retry progress never moves backward; it remains below100% until all region requests complete. Cancelled/failed work is not marked complete. The adapter observes response streams without changing their bytes, model weights, runtime arithmetic or decoding.

## Quality and runtime

The unchanged WebGPU release was qualified on Apple M2 / Chrome156 with **98.8603% pooled NFC character agreement** against corrected, uncompressed BF16-cast checkpoint18,404 on a frozen64-image / 71-region set; original whole-page parity was **97.3635%**. Zero caps/repeats, four model sessions, no warm model reloads or tracked request-tensor leaks. This is source agreement, not human OCR accuracy or a per-image guarantee. See `qualification.json` and `validation/`. The Space's own live UI and repeated-inference checks are recorded separately in `space-validation.json` when available.

170 linear matrices use GPTQ INT4 group32 with FP32 scales; embeddings, positions, convolutions, norms and biases retain higher precision. The custom ONNX Runtime Web 1.31.1 JSEP kernel rounds dequantized weights to BF16, with FP32 computation. Use this pinned runtime. Greedy decoding uses RP1.1, 2048 tokens per region, source resolution retry, and pixel-layout-v2. No deduplication, repeated-passage stopping or hidden truncation improves the result.

## Visuals and licenses

Typography, font sizes, palette and component styling are drawn directly from [persianvlm.com/ocr](https://persianvlm.com/ocr). Self-hosted original Vazirmatn Regular, SemiBold and Bold fonts are licensed under SIL OFL1.1. The page uses its 20px root type, gold `#dfbd70` / `#f3dda8`, burgundy `#771a38` and dark `#090708` design tokens. The interface is responsive and RTL, uses visible keyboard focus and respects reduced-motion preferences. `provenance.json` records source URLs and hashes.

Preserve OpenMDW1.1 `LICENSE`, the font OFL and all `licenses/` notices. Source model: NVIDIA Nemotron-3.5-Parse. No private evaluation images, user documents, raw protected transcriptions, training examples or credentials are included. Model/runtime file hashes are inherited from the pinned release and checked before publication.
