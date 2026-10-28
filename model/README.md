---
language:
- fa
- en
license: openmdw-1.1
base_model: nvidia/Nemotron-3.5-Parse
base_model_relation: finetune
library_name: transformers
pipeline_tag: image-to-text
tags:
- bina
- ocr
- persian
- farsi
- document-understanding
- custom_code
- safetensors
---
# Bina 0.4 Koochik

## Try Bina in your browser

Use the public [Bina 0.4 Koochik Space](https://huggingface.co/spaces/Reza2kn/Bina-0.4-Koochik) or its [standalone app](https://reza2kn-bina-0-4-koochik.static.hf.space/index.html). The Persian interface follows persianvlm.com/ocr. Inference runs on the visitor's device using the pinned checkpoint 18,404 WebGPU INT4 runtime; images and text are never uploaded. The first run downloads about 770 MB, then four sessions stay resident for subsequent images. PNG, JPG and WebP are supported; PDF is not. Current desktop Chrome/Edge with WebGPU is recommended. The published qualification scores remain scoped to the frozen 64 set, not a per-input guarantee.

Bina 0.4 Koochik is a 630,800,496-parameter image-to-text OCR model derived from [NVIDIA Nemotron-3.5-Parse](https://huggingface.co/nvidia/Nemotron-3.5-Parse), with a C-RADIOv4-SO400M vision backbone and an autoregressive text decoder. It is intended for Persian/Farsi document transcription, with English, math/Markdown and table routes supported by its task prompts.

This repository contains the **original uncompressed FP32 weights from checkpoint 18,404**, saved during the ongoing Bina 0.4 training run. It is a pinned release snapshot; later training checkpoints are not silently substituted. Main training, optimizer, sampler and training configuration were not changed to prepare this release. No optimizer, RNG, sampler state or evaluation images are included.

## Use the tested inference runner

Download the complete repository, then use Python 3.11 with `requirements.txt`:

```sh
hf download Reza2kn/Bina-0.4-Koochik --local-dir Bina-0.4-Koochik
cd Bina-0.4-Koochik
pip install -r requirements.txt
python run_ocr.py --image examples/demo.png --output result.json
```

The runner uses CUDA with BF16 when available and CPU with FP32 otherwise. `--device cpu` forces CPU. `--task markup` selects the Markdown/math prompt; default is plain OCR. Inputs are page/region images; rasterize PDFs before passing their pages to this runner. This is a custom Transformers model, so use `AutoModel`/`AutoProcessor` with `trust_remote_code=True`, as the supplied runner does, rather than assuming a generic pipeline or a hosted inference provider is available.

Default inference applies a pixel-only layout policy: shaded-sidebar partitioning and large blank-row splits, all original pixels included exactly once. Each region uses greedy decoding, repetition penalty 1.1, a 2,048-token per-attempt limit, natural EOS, and at most one source-policy resolution retry. There is no repeated-passage stopping guard, no-repeat constraint or duplicate-text removal. All raw region attempts/tokens are retained in the JSON output. `--policy original` preserves whole-page inference for diagnosis; the source model can replay text on complex whole pages.

The included demo image is newly authored synthetic text, not a training/calibration or protected evaluation example. The tested CPU FP32 runner transcribed both demo lines exactly and reached EOS without a cap or repetition. This smoke test is an installation/runtime check, **not a corpus OCR accuracy result**.

## Quantized versions and parity

Each published derivative has its own runtime files, model card and `base_model_relation: quantized` metadata pointing to this original model. Results below are measured on checkpoint 18,404 with matched corrected source decoding.

| Derivative | Frozen64 character parity |
|---|---:|
| [CoreML INT4](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-CoreML-INT4) | coreml: 98.9028% |
| [ONNX INT4 (auto CUDA / CPU)](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-ONNX-INT4) | onnx: 98.9028%; onnx-cuda: 98.9028% |
| [Browser WebGPU INT4](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-ONNX-WebGPU-INT4) | webgpu: 98.8603% |
| [Tract INT4 (auto Metal / CPU)](https://huggingface.co/Reza2kn/Bina-0.4-Koochik-Tract-INT4) | tract: 98.8745%; tract-metal: 98.9170% |

The native ONNX runner now automatically selects validated CUDA or CPU, and the Tract runner selects validated Metal or CPU on compatible macOS ARM64. GPU startup or inference failures in automatic mode restart the entire current region on CPU with fresh state. Explicit GPU modes raise instead. ONNX CoreML EP failed capability checks for these graphs, so ONNX on macOS currently uses CPU; use Tract Metal or native CoreML for Apple GPU inference. See each derivative card for installation, supported platforms and recovery evidence.

Ternary adaptation and unsupported runtime routes are not implied to pass the 98% gate merely because another format passes.

The engineering target is at least 98% pooled NFC character agreement to the matched uncompressed reference, with original whole-page agreement reported separately. Source agreement includes the source model's OCR errors; it is not human-annotated OCR accuracy or a per-input guarantee. CUDA BF16 and CPU FP32 are different arithmetic profiles and can produce different autoregressive outputs. Small decorative text, logos, calligraphy, low-quality scans and long complex layouts remain limitations. Any experimental ternary variant must be judged by its own quality/runtime evidence; the name alone does not imply native BitNet support or a speed benefit.

## Provenance and license

- Source checkpoint repository: `Reza2kn/Bina-0.4-Nemotron-Checkpoints-20261025`.
- Immutable revision: `a2a0251293ba92a120caa2dbb4ef8eac7eb12fd8`.
- Checkpoint step: 18,404.
- Publisher manifest SHA256: `70997dadcd7ca5348e575536a50fb07989c78c42b614a800163c62002abc52b6`.
- Canonical original weights SHA256: `cb62fc750923f21e4c6a03131d2a4f392d5046e109a154665dc491f43a74a564` (2,523,266,632 bytes).
- Inference architecture/code and tokenizer are preserved from that checkpoint. Full provenance is in `provenance.json`.

The model inherits **OpenMDW 1.1** from the source model/checkpoint repository. `LICENSE` preserves the upstream terms and tokenizer notices; NVIDIA source headers remain intact. The newly supplied runner/layout helpers do not alter the original model weights. A model release does not certify phone/ANE, every GPU/OS, serverless hosting or any untested runtime.
