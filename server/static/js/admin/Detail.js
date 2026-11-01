import { html, useEffect, useRef, useState } from '/vendor/htm-preact.js';
import { get } from './api.js';
import { kb, statusOf, STATUS_LABEL, when } from './util.js';

export function Detail({ job: j, onClose }) {
  const dialog = useRef(), [text, setText] = useState(null);
  useEffect(() => {
    if (!j) return;
    setText(null);
    dialog.current.showModal();
    let live = true;  // ignore a late answer for a job that is no longer open
    get(`/api/admin/text/${j.id}`).then(r => live && setText(r.text ?? 'No text (failed, still running, or recorded before text was kept)'));
    return () => { live = false; };
  }, [j?.id]);

  const st = j && statusOf(j);
  const rows = j && [['Status', html`<span class="st ${st}">${STATUS_LABEL[st]}</span>`], ['Time', when(j.created)], ['Client', j.client], ['IP', j.ip ?? '-'],
    ['Image', `${j.width}×${j.height}, ${kb(j.bytes)}`], ['Seconds', j.seconds ?? '-'], ['Characters', j.chars ?? '-']];
  return html`<dialog class="job" ref=${dialog} aria-labelledby="d-title" onClose=${onClose} onClick=${e => e.target === dialog.current && dialog.current.close()}>
    <div class="d-head">
      <h2 id="d-title">${j && `Job #${j.id}`}</h2>${j && html`<span class="st ${st}">${STATUS_LABEL[st]}</span>`}
      <span style="flex:1"></span>
      ${text && html`<button onClick=${() => navigator.clipboard.writeText(text)}>Copy text</button>`}
      <button class="ghost" aria-label="Close" onClick=${() => dialog.current.close()}>✕</button>
    </div>
    ${j && html`<div class="d-body">
      <a class="d-img" href="/api/admin/thumb/${j.id}" target="_blank"><img src="/api/admin/thumb/${j.id}" alt="Thumbnail of job ${j.id}"/></a>
      <div class="d-info">
        <dl>${rows.slice(1).map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
        ${j.error ? html`<pre>${j.error}</pre>` : null}
        <pre class="ocr">${text ?? 'Loading…'}</pre>
      </div>
    </div>`}
  </dialog>`;
}
