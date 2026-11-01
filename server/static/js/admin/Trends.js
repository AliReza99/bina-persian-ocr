import { html, useMemo } from '/vendor/htm-preact.js';
import { Chart } from './Chart.js';
import { css } from './util.js';

const RANGES = ['1h', '24h', '7d'];

function chartOpts() {
  const [ok, inc, err, acc, s2] = ['--ok', '--inc', '--err', '--accent', '--s2'].map(css);
  const bars = uPlot.paths.bars({ size: [0.7, 40] });
  const secs = (u, v) => v == null ? '-' : v + ' s';
  return {
    // stacked: each series is a running sum, so its own count is the gap to the next one
    jobs: {
      scales: { y: { range: (u, min, max) => [0, Math.max(1, max)] } },
      series: [{}, ...[['error', err], ['cut short', inc], ['ok', ok]].map(([label, c]) => ({ label, fill: c, stroke: c, paths: bars,
        points: { show: false }, value: (u, v, si, i) => i == null ? '-' : v - (u.data[si + 1]?.[i] ?? 0) }))],
    },
    lat: { series: [{}, { label: 'avg', stroke: acc, width: 2, spanGaps: true, points: { show: true, size: 5 }, value: secs },
      { label: 'p95', stroke: s2, width: 2, dash: [5, 4], spanGaps: true, points: { show: true, size: 5 }, value: secs }] },
  };
}

export function Trends({ d, range, setRange }) {
  const opts = useMemo(chartOpts, []);
  const data = useMemo(() => {
    const sum = (...ks) => d.t.map((_, i) => ks.reduce((a, k) => a + d[k][i], 0));
    // full stack first, then shorter stacks drawn on top of it
    return { jobs: [d.t, sum('ok', 'incomplete', 'error'), sum('ok', 'incomplete'), d.ok], lat: [d.t, d.avg, d.p95] };
  }, [d]);
  const t = d.totals, done = t.ok + t.incomplete + t.error;
  const stats = [
    ['Jobs', t.jobs], ['OK', done ? html`${Math.round(t.ok / done * 1000) / 10}<small>%</small>` : '-'],
    ['Errors', t.error, t.error && 'bad'], ['Cut short', t.incomplete, t.incomplete && 'warn'], ['Rejected', t.rejected, t.rejected && 'bad'],
    ['Avg', t.avg == null ? '-' : html`${t.avg}<small> s</small>`], ['p95', t.p95 == null ? '-' : html`${t.p95}<small> s</small>`],
  ];
  return html`<h2>Traffic
    <span class="tabs">${RANGES.map(r => html`<button key=${r} aria-pressed=${r === range} onClick=${() => setRange(r)}>${r}</button>`)}</span>
  </h2>
  <div class="card stats">${stats.map(([k, v, cls]) => html`<div key=${k}><div class="k">${k}</div><div class=${'v ' + (cls || '')}>${v}</div></div>`)}</div>
  <div class="charts">
    <div class="card"><div class="k">Jobs</div><${Chart} opts=${opts.jobs} data=${data.jobs}/></div>
    <div class="card"><div class="k">Seconds per job</div><${Chart} opts=${opts.lat} data=${data.lat}/></div>
    <div class="card"><div class="k">Clients</div><${Bars} list=${d.clients}/></div>
  </div>`;
}

function Bars({ list }) {
  const top = list[0]?.[1] || 1;
  return html`<div class="bars">${list.length ? list.slice(0, 10).map(([c, n]) => html`<div key=${c}>
    <span title=${c}>${c}</span><b style=${{ width: n / top * 100 + '%' }}></b><span>${n}</span></div>`)
    : html`<div class="sub">no jobs</div>`}</div>`;
}
