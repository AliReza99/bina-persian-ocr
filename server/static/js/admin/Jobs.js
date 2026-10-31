import { html, useState } from '/vendor/htm-preact.js';
import { get, usePoll } from './api.js';
import { Detail } from './Detail.js';
import { ago, kb, statusOf, STATUS_LABEL, when } from './util.js';

const PAGE = 50;

// tick: bumped by the page to force a reload (e.g. after Clear history)
export function Jobs({ clients, tasks, tick, children }) {
  const [f, setF] = useState({ status: '', client: '', task: '', id: '', sort: 'recent' });
  const [offset, setOffset] = useState(0);
  const [fullTime, setFullTime] = useState(false);  // time column: relative by default, a click switches every row
  const [open, setOpen] = useState(null);
  const [res] = usePoll(() => get('/admin/jobs?' + new URLSearchParams({ ...f, offset, limit: PAGE })), 15000, [f, offset, tick]);
  const jobs = res?.jobs || [], total = res?.total || 0;

  const filter = k => e => { setF({ ...f, [k]: e.target.value }); setOffset(0); };
  // keep the current choice even when the chart range no longer lists it
  const options = (list, cur) => [...new Set(list.map(x => x[0]).concat(cur ? [cur] : []))].map(v => html`<option key=${v}>${v}</option>`);

  return html`<h2>History <small>kept 30 days</small><span style="margin-inline-start:auto">${children}</span></h2>
  <div class="filters">
    <select aria-label="Status" value=${f.status} onChange=${filter('status')}>
      <option value="">All statuses</option><option value="ok">OK</option><option value="incomplete">Cut short</option>
      <option value="error">Error</option><option value="running">Running</option>
    </select>
    <select aria-label="Client" value=${f.client} onChange=${filter('client')}><option value="">All clients</option>${options(clients, f.client)}</select>
    <select aria-label="Task" value=${f.task} onChange=${filter('task')}><option value="">All tasks</option>${options(tasks, f.task)}</select>
    <input type="number" min="1" placeholder="Job #" aria-label="Job id" value=${f.id} onChange=${filter('id')}/>
    <select aria-label="Sort" value=${f.sort} onChange=${filter('sort')}>
      <option value="recent">Newest</option><option value="slowest">Slowest</option><option value="failed">Errors first</option>
    </select>
  </div>
  <div class="card table">
    <table>
      <thead><tr><th>#</th><th>Image</th><th>Time</th><th>Client</th><th>Task</th><th>Size</th><th>Bytes</th><th>Seconds</th><th>Chars</th><th>Status</th></tr></thead>
      <tbody>${jobs.length ? jobs.map(j => html`<tr key=${j.id} tabindex="0" onClick=${() => setOpen(j)} onKeyDown=${e => e.key === 'Enter' && setOpen(j)}>
        <td>${j.id}</td><td><img src="/admin/thumb/${j.id}" alt="" loading="lazy"/></td>
        <td class="time" title=${fullTime ? ago(j.created) : when(j.created)} onClick=${e => { e.stopPropagation(); setFullTime(!fullTime); }}>
          ${fullTime ? when(j.created) : ago(j.created)}</td>
        <td>${j.client}</td><td>${j.task}</td><td>${j.width}×${j.height}</td><td>${kb(j.bytes)}</td>
        <td>${j.seconds ?? '-'}</td><td>${j.chars ?? '-'}</td><td class="st ${statusOf(j)}">${STATUS_LABEL[statusOf(j)]}</td>
      </tr>`) : html`<tr><td colspan="10" style="text-align:center;color:var(--muted)">No jobs match</td></tr>`}</tbody>
    </table>
    <div class="pager">
      <span>${total ? `${offset + 1}–${offset + jobs.length} of ${total}` : ''}</span>
      <button disabled=${offset === 0} onClick=${() => setOffset(Math.max(0, offset - PAGE))}>Previous</button>
      <button disabled=${offset + PAGE >= total} onClick=${() => setOffset(offset + PAGE)}>Next</button>
    </div>
  </div>
  <${Detail} job=${open} onClose=${() => setOpen(null)}/>`;
}
