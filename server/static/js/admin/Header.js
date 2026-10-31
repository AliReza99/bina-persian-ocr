import { html } from '/vendor/htm-preact.js';
import { dur } from './util.js';

export function Header({ state }) {
  const run = state.running;
  const [label, cls] = state.paused ? ['Paused', 'paused']
    : run ? [`Processing #${run.id} · ${Math.round(Date.now() / 1000 - run.started)}s`, 'busy'] : ['Ready', ''];
  return html`<header>
    <h1>Bina OCR</h1>
    <span class="badge ${cls}" role="status">${label}</span>
    <div class="meta"><span>v${state.version} · ${state.device} · up ${dur(state.uptime)}</span><a href="/">Test OCR</a><a href="/docs">API docs</a></div>
  </header>`;
}
