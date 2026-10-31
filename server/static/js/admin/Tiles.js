import { html } from '/vendor/htm-preact.js';
import { Card, Spark } from './Card.js';
import { css } from './util.js';

export function Tiles({ stats: s, d }) {
  const jobsPer = d.t.map((_, i) => d.ok[i] + d.incomplete[i] + d.error[i]);
  const okPct = d.t.map((_, i) => jobsPer[i] ? d.ok[i] / jobsPer[i] * 100 : null);
  const [ok, inc, err, acc] = ['--ok', '--inc', '--err', '--accent'].map(css);
  const tiles = [
    ['Pages read', s.jobs_24h, 'Requests that reached the model', jobsPer, acc],
    ['Fully read', s.success_pct == null ? '-' : html`${s.success_pct}<small>%</small>`, 'Finished with all their text', okPct, ok],
    ['Failed', s.errors_24h, 'Crashed with an error, no text', d.error, err],
    ['Cut short', s.incomplete_24h, 'Hit the time limit, text partial', d.incomplete, inc],
    ['Typical time', s.avg_seconds == null ? '-' : html`${s.avg_seconds}<small> s</small>`, 'Average seconds per page', d.avg, acc],
    ['Slow pages', s.p95_seconds == null ? '-' : html`${s.p95_seconds}<small> s</small>`, '1 in 20 pages takes this long or more', d.p95, acc],
    ['Turned away', s.busy_24h, 'Refused because the queue was full', d.rejected, err],
  ];
  return html`<h2>Last 24 hours</h2>
  <${Summary} s=${s}/>
  <div class="grid tiles" style="margin-top:12px">${tiles.map(([k, v, hint, values, color]) => html`
    <${Card} key=${k} k=${k} v=${v} hint=${hint}><${Spark} values=${values} color=${color}/><//>`)}</div>`;
}

// the tiles in one sentence, for someone who does not read charts
function Summary({ s }) {
  if (!s.jobs_24h) return html`<div class="summary">No pages read in the last 24 hours${s.busy_24h ? html`, but <b class="bad">${s.busy_24h}</b> were turned away` : ''}.</div>`;
  const ok = s.jobs_24h - s.errors_24h - s.incomplete_24h;
  return html`<div class="summary">
    <b>${s.jobs_24h}</b> pages read, <b>${ok}</b> fully (${s.success_pct}%)${s.incomplete_24h ? html`, <b class="warn">${s.incomplete_24h}</b> cut short by the time limit` : ''}${s.errors_24h ? html`, <b class="bad">${s.errors_24h}</b> failed` : ''}.${' '}
    A page usually takes <b>${s.avg_seconds} s</b>; the slowest ones take <b>${s.p95_seconds} s</b> or more.${' '}
    ${s.busy_24h ? html`<b class="bad">${s.busy_24h}</b> requests were turned away because the queue was full.` : 'Nobody was turned away.'}
  </div>`;
}
