import { html, useMemo } from '/vendor/htm-preact.js';
import { Head } from './Card.js';
import { Chart } from './Chart.js';
import { css } from './util.js';

const RANGES = [['1h', 'Last hour'], ['24h', 'Last 24 hours'], ['7d', 'Last 7 days']];
const EDGES = [5, 10, 20, 30, 60, 120];  // time histogram bucket edges, seconds

function chartOpts() {
  const [ok, inc, err, acc, s2] = ['--ok', '--inc', '--err', '--accent', '--s2'].map(css);
  const bars = uPlot.paths.bars({ size: [0.7, 40] });
  return {
    // stacked: each series is a running sum, so its own count is the gap to the next one
    jobs: {
      scales: { y: { range: (u, min, max) => [0, Math.max(1, max)] } },
      series: [{}, ...[['Failed', err], ['Cut short', inc], ['Fully read', ok]].map(([label, c]) => ({ label, fill: c, stroke: c, paths: bars,
        points: { show: false }, value: (u, v, si, i) => i == null ? '-' : v - (u.data[si + 1]?.[i] ?? 0) }))],
    },
    lat: { series: [{}, { label: 'Typical', stroke: acc, width: 2, spanGaps: true, points: { show: true, size: 6 }, value: (u, v) => v == null ? '-' : v + ' s' },
      { label: 'Slow pages', stroke: s2, width: 2, dash: [5, 4], spanGaps: true, points: { show: true, size: 6 }, value: (u, v) => v == null ? '-' : v + ' s' }] },
  };
}

export function Trends({ d, range, setRange }) {
  const opts = useMemo(chartOpts, []);
  const data = useMemo(() => {
    const sum = (...ks) => d.t.map((_, i) => ks.reduce((a, k) => a + d[k][i], 0));
    return {
      // full stack first, then shorter stacks drawn on top of it
      jobs: [d.t, sum('ok', 'incomplete', 'error'), sum('ok', 'incomplete'), d.ok],
      lat: [d.t, d.avg, d.p95],
    };
  }, [d]);
  return html`<h2>Over time
    <span class="tabs">${RANGES.map(([r, l]) => html`<button key=${r} aria-pressed=${r === range} onClick=${() => setRange(r)}>${l}</button>`)}</span>
  </h2>
  <div class="charts">
    <div class="card"><${Head} k="Pages read" hint="Each bar is a slice of time; colors show how those pages ended"/><${Chart} opts=${opts.jobs} data=${data.jobs}/></div>
    <div class="card"><${Head} k="Seconds per page" hint="Typical = average; slow pages = the slowest 1 in 20"/><${Chart} opts=${opts.lat} data=${data.lat}/></div>
    <div class="card"><${Head} k="How long pages take" hint="Number of pages that finished within each time"/><${Times} secs=${d.scatter.map(p => p[1])}/></div>
    <div class="card">
      <${Head} k="Who sends pages" hint="By client token name"/><${Bars} list=${d.clients}/>
    </div>
  </div>`;
}

function Times({ secs }) {
  if (!secs.length) return html`<div class="hint">No finished pages</div>`;
  const counts = [...EDGES, Infinity].map((hi, i) => ({
    label: hi === Infinity ? `over ${EDGES.at(-1)} s` : `${i ? EDGES[i - 1] : 0}–${hi} s`,
    n: secs.filter(s => s >= (i ? EDGES[i - 1] : 0) && s < hi).length,
  }));
  const top = Math.max(...counts.map(c => c.n));
  return html`<div class="hist" role="img" aria-label=${counts.map(c => `${c.label}: ${c.n}`).join(', ')}>
    ${counts.map(c => html`<div key=${c.label}><em>${c.n || ''}</em><b style=${{ height: c.n / top * 100 + '%' }}></b><span>${c.label}</span></div>`)}
  </div>`;
}

function Bars({ list, color = '--accent' }) {
  const top = list[0]?.[1] || 1, all = list.reduce((a, x) => a + x[1], 0);
  return html`<div class="bars">${list.length ? list.slice(0, 8).map(([c, n]) => html`<div key=${c}>
    <span title=${c}>${c}</span><b style=${{ width: n / top * 100 + '%', background: `var(${color})` }}></b><span>${n} · ${Math.round(n / all * 100)}%</span></div>`)
    : html`<div class="hint">No jobs</div>`}</div>`;
}
