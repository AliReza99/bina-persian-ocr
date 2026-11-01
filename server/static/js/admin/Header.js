import { html } from '/vendor/htm-preact.js';
import { dur } from './util.js';

// same bar as the playground on /
export function Header({ state }) {
  const run = state.running;
  const [cls, label] = state.paused ? ['paused', 'paused']
    : run ? ['busy', `#${run.id} · ${Math.round(Date.now() / 1000 - run.started)}s`] : ['', 'ready'];
  return html`<header>
    <h1>Bina OCR</h1>
    <nav><a href="/">Playground</a><a class="on" href="/admin">Admin</a><a href="/docs">API docs</a></nav>
    <span class="grow"></span>
    <span class=${'health ' + cls} role="status"><i></i>${label} · ${state.device} · v${state.version} · up ${dur(state.uptime)}</span>
  </header>`;
}
