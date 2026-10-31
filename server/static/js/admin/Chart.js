import { html, useEffect, useRef } from '/vendor/htm-preact.js';
import { css } from './util.js';

// uPlot is built once per opts; new data goes through setData so the chart never flashes
export function Chart({ opts, data }) {
  const el = useRef(), plot = useRef();
  useEffect(() => {
    const box = el.current, size = () => ({ width: box.clientWidth, height: box.clientHeight - 30 });
    const grid = { stroke: css('--line'), width: 1 }, axis = { stroke: css('--muted'), grid, ticks: grid };
    const u = plot.current = new uPlot({ ...size(), axes: [axis, { ...axis, size: 44 }], ...opts }, data, box);
    const ro = new ResizeObserver(() => u.setSize(size()));
    ro.observe(box);
    return () => { ro.disconnect(); u.destroy(); };
  }, [opts]);
  useEffect(() => plot.current.setData(data), [data]);
  return html`<div class="chart" ref=${el}></div>`;
}
