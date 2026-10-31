import { html, useMemo } from '/vendor/htm-preact.js';
import { Chart } from './Chart.js';
import { css } from './util.js';

const RANGES = ['1h', '24h', '7d'];

function chartOpts() {
  const [ok, inc, err, acc, s2] = ['--ok', '--inc', '--err', '--accent', '--s2'].map(css);
  const bars = uPlot.paths.bars({ size: [0.7, 40] });
  return {
    // stacked: each series is a running sum, so its own count is the gap to the next one
    jobs: {
      scales: { y: { range: (u, min, max) => [0, Math.max(1, max)] } },
      series: [{}, ...[['Error', err], ['Incomplete', inc], ['OK', ok]].map(([label, c]) => ({ label, fill: c, stroke: c, paths: bars,
        points: { show: false }, value: (u, v, si, i) => i == null ? '-' : v - (u.data[si + 1]?.[i] ?? 0) }))],
    },
    lat: { series: [{}, { label: 'avg', stroke: acc, width: 2, spanGaps: true }, { label: 'p95', stroke: s2, width: 2, dash: [5, 4], spanGaps: true }] },
    scatter: {
      mode: 1, scales: { x: { time: false } },
      series: [{ label: 'MP' }, { label: 'seconds', stroke: acc, paths: () => null, points: { show: true, size: 7, fill: acc } }],
    },
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
      scatter: [d.scatter.map(p => p[0]), d.scatter.map(p => p[1])],
    };
  }, [d]);
  return html`<h2>Trends
    <span class="tabs">${RANGES.map(r => html`<button key=${r} aria-pressed=${r === range} onClick=${() => setRange(r)}>${r}</button>`)}</span>
  </h2>
  <div class="charts">
    <div class="card"><div class="k">Jobs per bucket</div><${Chart} opts=${opts.jobs} data=${data.jobs}/></div>
    <div class="card"><div class="k">Latency, seconds</div><${Chart} opts=${opts.lat} data=${data.lat}/></div>
    <div class="card"><div class="k">Seconds vs megapixels</div><${Chart} opts=${opts.scatter} data=${data.scatter}/></div>
    <div class="card">
      <div class="k">Clients</div><${Clients} list=${d.clients}/>
      <div class="k" style="margin-top:14px">Tasks</div><${Tasks} list=${d.tasks}/>
    </div>
  </div>`;
}

function Clients({ list }) {
  const top = list[0]?.[1] || 1;
  return html`<div class="bars">${list.length ? list.slice(0, 8).map(([c, n]) => html`<div key=${c}>
    <span title=${c}>${c}</span><b style=${{ width: n / top * 100 + '%' }}></b><span>${n}</span></div>`) : html`<div class="k">No jobs</div>`}</div>`;
}

function Tasks({ list }) {
  const palette = ['--accent', '--s2', '--ok', '--inc', '--err'].map(css), all = list.reduce((a, t) => a + t[1], 0);
  if (!all) return html`<div class="donut"><div class="k">No jobs</div></div>`;
  let at = 0;
  const stops = list.map(([, n], i) => `${palette[i % 5]} ${at / all * 360}deg ${(at += n) / all * 360}deg`);
  return html`<div class="donut">
    <div style=${{ background: `conic-gradient(${stops.join(',')})` }} role="img" aria-label="Task split"></div>
    <div>${list.map(([t, n], i) => html`<div key=${t}><span class="dot" style=${{ background: palette[i % 5] }}></span>${t} · ${n} (${Math.round(n / all * 100)}%)</div>`)}</div>
  </div>`;
}
