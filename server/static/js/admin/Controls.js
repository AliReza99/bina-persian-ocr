import { html, useState } from '/vendor/htm-preact.js';
import { post } from './api.js';

export function Controls({ state, refresh }) {
  const [sec, setSec] = useState('');
  const toggle = async () => { await post(state.paused ? '/admin/resume' : '/admin/pause'); refresh(); };
  const setLimit = async max_seconds => {
    const res = await post('/admin/limit', { max_seconds });
    if (!res.ok) return alert(res.body.error);
    setSec('');
    refresh();
  };
  return html`<h2>Controls</h2>
  <div class="controls">
    <div class="card control">
      <div><div class="k">Requests</div><div class="v">${state.paused ? 'Paused' : 'Accepting'}</div>
        <p>Paused: new requests are refused; pages already running or waiting still finish.</p></div>
      <div class="act"><button class="primary" onClick=${toggle}>${state.paused ? 'Resume' : 'Pause'}</button></div>
    </div>
    <form class="card control" onSubmit=${e => { e.preventDefault(); setLimit(Number(sec)); }}>
      <div><div class="k">Time limit per job</div><div class="v">${state.max_seconds ? `${state.max_seconds} s` : 'No limit'}</div>
        <p>A page that takes longer returns what was read so far, marked cut short.</p></div>
      <div class="act">
        <label class="unit"><input type="number" min="5" max="3600" step="1" required placeholder="e.g. 90" aria-label="Time limit in seconds"
          value=${sec} onInput=${e => setSec(e.target.value)}/><span>s</span></label>
        <button>Set</button>
        ${state.max_seconds ? html`<button type="button" class="ghost" onClick=${() => setLimit(null)}>Remove</button>` : null}
      </div>
    </form>
  </div>`;
}
