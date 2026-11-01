import { html, useState } from '/vendor/htm-preact.js';
import { get, usePoll } from './api.js';
import { Detail } from './Detail.js';
import { ago, FLAG_LABEL, kb, statusOf, STATUS_LABEL, when } from './util.js';

const PAGE = 50;

// tick: bumped by the page to force a reload (e.g. after Clear history)
const flagTip = j => Object.entries(j.flags).map(([k, v]) => `${FLAG_LABEL[k]}: ${v}`).join('\n');

export function Jobs({ tick, children }) {
  const [f, setF] = useState({ status: '', flag: '', client: '', id: '', sort: 'recent' });
  const [offset, setOffset] = useState(0);
  const [fullTime, setFullTime] = useState(false);  // time column: relative by default, a click switches every row
  const [open, setOpen] = useState(null);
  const [res] = usePoll(() => get('/api/admin/jobs?' + new URLSearchParams({ ...f, offset, limit: PAGE })), 15000, [f, offset, tick]);
  const jobs = res?.jobs || [], total = res?.total || 0;

  const filter = k => e => { setF({ ...f, [k]: e.target.value }); setOffset(0); };
  const clients = res?.clients || [];

  return html`<h2>Jobs <small>30 days</small>
  <span class="filters">
    <select aria-label="Status" value=${f.status} onChange=${filter('status')}>
      <option value="">All statuses</option><option value="ok">OK</option><option value="incomplete">Cut short</option>
      <option value="error">Error</option><option value="running">Running</option>
    </select>
    <select aria-label="Flag" value=${f.flag} onChange=${filter('flag')}>
      <option value="">All pages</option><option value="any">Flagged</option>${Object.entries(FLAG_LABEL).map(([k, v]) => html`<option key=${k} value=${k}>${v}</option>`)}
    </select>
    <select aria-label="Client" value=${f.client} onChange=${filter('client')}><option value="">All clients</option>${clients.map(c => html`<option key=${c} value=${c}>${c}</option>`)}</select>
    <input type="number" min="1" placeholder="Job #" aria-label="Job id" value=${f.id} onChange=${filter('id')}/>
    <select aria-label="Sort" value=${f.sort} onChange=${filter('sort')}>
      <option value="recent">Newest</option><option value="slowest">Slowest</option><option value="failed">Errors first</option>
    </select>
  </span>
  <span class="grow"></span>${children}</h2>
  <div class="card table">
    <table>
      <thead><tr><th>#</th><th>Image</th><th>Time</th><th>Client</th><th>Size</th><th>Bytes</th><th>Sec</th><th>Chars</th><th>Status</th><th>Flags</th></tr></thead>
      <tbody>${jobs.length ? jobs.map(j => html`<tr key=${j.id} tabindex="0" onClick=${() => setOpen(j)} onKeyDown=${e => e.key === 'Enter' && setOpen(j)}>
        <td>${j.id}</td><td><img src="/api/admin/thumb/${j.id}" alt="" loading="lazy"/></td>
        <td class="time" title=${fullTime ? ago(j.created) : when(j.created)} onClick=${e => { e.stopPropagation(); setFullTime(!fullTime); }}>
          ${fullTime ? when(j.created) : ago(j.created)}</td>
        <td>${j.client}</td><td>${j.width}×${j.height}</td><td>${kb(j.bytes)}</td>
        <td>${j.seconds ?? '-'}</td><td>${j.chars ?? '-'}</td><td class="st ${statusOf(j)}">${STATUS_LABEL[statusOf(j)]}</td>
        <td class="flags">${flagTip(j) && html`<span role="img" aria-label=${flagTip(j)} title=${flagTip(j)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg></span>`}</td>
      </tr>`) : html`<tr class="static"><td colspan="10" class="empty">No jobs match</td></tr>`}</tbody>
    </table>
    <div class="pager">
      <span>${total ? `${offset + 1}–${offset + jobs.length} of ${total}` : ''}</span>
      <button disabled=${offset === 0} onClick=${() => setOffset(Math.max(0, offset - PAGE))}>Previous</button>
      <button disabled=${offset + PAGE >= total} onClick=${() => setOffset(offset + PAGE)}>Next</button>
    </div>
  </div>
  <${Detail} job=${open} onClose=${() => setOpen(null)}/>`;
}
