# Proposal: empty-region guard (not implemented)

Status: idea, parked 2026-11-01. Implement only if bleed-through photos turn out to be common.

## Problem

On phone photos of thin book paper, faint text from the back of the page shows through.
Bina reads those ghosts as text: empty Markdown tables or invented Persian. Sometimes it doesn't
repeat itself, so the loop guard (`decoding.LoopStop`) only fires late or never.

Example: a 1200x1600 photo of an English chapter page. The layout split it into 4 regions; the top
one (y 0-714) holds only show-through. Bina wrote 3,472 tokens of fake Persian there (~7.5s) before
the loop was caught.

Today's fix (`server/ocr.py`): on the first loop, the whole page is read again in grayscale with
autocontrast. It works (30s of garbage -> 8s clean), but the ~7.5s spent on fake text is still wasted.

## Idea

The box detector (`align.persian_rows`, already running on the CPU while Bina reads) finds real text
lines and ignores the faint ghosts. Rule:

> A layout region with **0 detector boxes** gets a small token cap (~64). Going over it counts as a
> loop, so the contrast retry starts at once.

## Evidence (detector boxes per layout region)

| image | regions (y range: boxes) |
|---|---|
| show-through book page | 0-714: **0**, 714-879: 1, 879-1334: 4, 1334-1600: **0** |
| 10 other test pages (`ocr-test/`, `samples/img.jpg`) | 1 region each, 5-62 boxes |

The only 0-box regions were the ghost-only ones. Detector time: 0.5-2.3s per page (it also runs Tesseract reads).

## Expected gain

On the example page, the retry starts after ~1.8s (detector ready) instead of ~7.5s: ~8s -> ~2.5s total.

## Tradeoffs

Good:
- Also catches fake text that never loops (as long as it is in a 0-box region).
- Pages where the detector sees text are never touched. Worst case (detector misses a whole short
  region, like a lone page number): Bina is capped at 64 tokens, still enough for a few words.
- Small change: one count, one cap.

Bad:
- Narrow: helps only when the layout split happens to isolate a ghost-only area. Ghosts sharing a
  region with real text (most pages are one region) give that region boxes, so nothing changes.
- Waits for the detector: Bina reaches 64 tokens in ~0.15s, but boxes take 0.5-2.3s. A boxes-only
  step without the Tesseract reads would be faster, at the cost of more code.
- Heavy bleed-through: if the detector boxes the ghosts too, the rule stays quiet (safe, no help).
- The detector becomes part of reading text, not just line boxes. If it fails or is slow, reading
  must go on uncapped.
- Thin proof: one ghost page, ten clean ones.

## Sketch

- In `transcribe`, give `_ocr_region` the detector future (`rows` from `app.run_job`) and the region bbox.
- Add a `StoppingCriteria` next to `LoopStop`: once the future is done and the region has 0 box
  centers, stop when generated tokens > 64 and mark the attempt as looped.
- Detector error or timeout: no cap.
- Before merging, run `ocr-test/` and confirm no text changes.

## Related ideas (rejected for now)

- Per-region token budget from box count (~100 tokens per box): wider coverage, but detector misses
  cut real text short and the tokens-per-box number is hard to tune.
- Cross-check Bina's text against the detector's Tesseract reads, redo on low match: no speed gain,
  and the rough reads are often bad (e.g. `he try indchngurlT gdies`), giving false retries.
- White out everything outside detector boxes: kills ghosts, but a missed line is lost for good.
