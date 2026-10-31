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
    get(`/admin/text/${j.id}`).then(r => live && setText(r.text ?? 'No text (failed, still running, or recorded before text was kept)'));
    return () => { live = false; };
  }, [j?.id]);

  const st = j && statusOf(j);
  const rows = j && [['Status', html`<span class="st ${st}">${STATUS_LABEL[st]}</span>`], ['Time', when(j.created)], ['Client', j.client], ['IP', j.ip ?? '-'],
    ['Task', j.task], ['Image', `${j.width}×${j.height}, ${kb(j.bytes)}`], ['Seconds', j.seconds ?? '-'], ['Characters', j.chars ?? '-']];
  return html`<dialog ref=${dialog} aria-labelledby="d-title" onClose=${onClose} onClick=${e => e.target === dialog.current && dialog.current.close()}>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h2 id="d-title" style="margin:0;font-size:18px;text-transform:none;letter-spacing:0;color:var(--fg)">${j && `Job #${j.id}`}</h2>
      <button onClick=${() => dialog.current.close()}>Close</button>
    </div>
    ${j && html`<div>
      <a href="/admin/thumb/${j.id}" target="_blank"><img src="/admin/thumb/${j.id}" alt="Thumbnail of job ${j.id}"/></a>
      <dl>${rows.map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>
      ${j.error ? html`<pre>${j.error}</pre>` : null}
      <h3>Extracted text</h3><pre class="ocr">${text ?? 'Loading…'}</pre>
    </div>`}
  </dialog>`;
}
