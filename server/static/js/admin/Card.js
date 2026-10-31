import { html } from '/vendor/htm-preact.js';

export const Card = ({ k, v, hint, children }) => html`<div class="card" title=${hint}><div class="k">${k}</div><div class="v">${v}</div>
  ${hint && html`<div class="hint">${hint}</div>`}${children}</div>`;

// chart card title with a one-line plain-language explanation
export const Head = ({ k, hint }) => html`<div class="head"><div class="k">${k}</div><div class="hint">${hint}</div></div>`;

export const Meter = ({ pct }) => html`<div class="meter"><i style=${{ width: Math.min(100, pct) + '%' }}></i></div>`;

export function Spark({ values, color }) {
  const v = values.map(x => x ?? null), nums = v.filter(x => x != null);
  if (nums.length < 2) return html`<svg class="spark"></svg>`;
  const max = Math.max(...nums), min = Math.min(0, ...nums), span = max - min || 1;
  const pts = v.map((x, i) => x == null ? null : `${(i / (v.length - 1) * 100).toFixed(1)},${(34 - (x - min) / span * 32).toFixed(1)}`).filter(Boolean).join(' ');
  return html`<svg class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
    <polyline points=${`0,36 ${pts} 100,36`} fill=${color} fill-opacity=".12" stroke="none"/>
    <polyline points=${pts} fill="none" stroke=${color} stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>`;
}
