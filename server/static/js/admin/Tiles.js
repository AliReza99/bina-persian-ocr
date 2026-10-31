import { html } from '/vendor/htm-preact.js';
import { Card, Spark } from './Card.js';
import { css } from './util.js';

export function Tiles({ stats: s, d }) {
  const jobsPer = d.t.map((_, i) => d.ok[i] + d.incomplete[i] + d.error[i]);
  const okPct = d.t.map((_, i) => jobsPer[i] ? d.ok[i] / jobsPer[i] * 100 : null);
  const [ok, inc, err, acc] = ['--ok', '--inc', '--err', '--accent'].map(css);
  const tiles = [
    ['Jobs', s.jobs_24h, jobsPer, acc],
    ['Success', s.success_pct == null ? '-' : html`${s.success_pct}<small>%</small>`, okPct, ok],
    ['Errors', s.errors_24h, d.error, err],
    ['Incomplete', s.incomplete_24h, d.incomplete, inc],
    ['Avg seconds', s.avg_seconds ?? '-', d.avg, acc],
    ['p95 seconds', s.p95_seconds ?? '-', d.p95, acc],
    ['Rejected, queue full', s.busy_24h, d.rejected, err],
  ];
  return html`<h2>Last 24 hours</h2>
  <div class="grid">${tiles.map(([k, v, values, color]) => html`<${Card} key=${k} k=${k} v=${v}><${Spark} values=${values} color=${color}/><//>`)}</div>`;
}
