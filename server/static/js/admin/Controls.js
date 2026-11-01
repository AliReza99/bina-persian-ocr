import { html, useState } from '/vendor/htm-preact.js';
import { post } from './api.js';

export function Controls({ state, refresh }) {
  const [sec, setSec] = useState('');
  const toggle = async () => { await post(state.paused ? '/api/admin/resume' : '/api/admin/pause'); refresh(); };
  const setLimit = async max_seconds => {
    const res = await post('/api/admin/limit', { max_seconds });
    if (!res.ok) return alert(res.body.error);
    setSec('');
    refresh();
  };
  return html`<div class="card ctl">
    <div class="row">
      <span class="k">Service</span>
      <b class=${state.paused ? 'warn' : 'good'}>${state.paused ? 'Paused' : 'Running'}</b>
      <button class=${state.paused ? 'primary' : ''} title="Paused: new requests get 503; queued jobs still finish" onClick=${toggle}>
        ${state.paused ? 'Resume' : 'Pause'}</button>
    </div>
    <form class="row" onSubmit=${e => { e.preventDefault(); setLimit(Number(sec)); }}>
      <span class="k">Time limit</span>
      <b>${state.max_seconds ? `${state.max_seconds} s` : 'none'}</b>
      <label class="unit" title="Longer jobs return partial text, marked cut short"><input type="number" min="5" max="3600" step="1" required placeholder="sec"
        aria-label="Time limit in seconds" value=${sec} onInput=${e => setSec(e.target.value)}/><span>s</span></label>
      <button>Set</button>
      ${state.max_seconds ? html`<button type="button" class="ghost" onClick=${() => setLimit(null)}>Remove</button>` : null}
    </form>
  </div>`;
}
