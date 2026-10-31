import { html, useEffect, useRef, useState } from '/vendor/htm-preact.js';
import { get, post, usePoll } from './api.js';
import { ago, when } from './util.js';

export function Tokens() {
  const [res, reload] = usePoll(() => get('/admin/tokens'));
  const [armed, setArmed] = useState(null);  // two-step confirm: id of the token whose Revoke was clicked once
  const [name, setName] = useState('');
  const [made, setMade] = useState(null);  // plain token, shown once
  const [copied, setCopied] = useState(false);
  const tokens = res?.tokens || [], madeInput = useRef();
  useEffect(() => madeInput.current?.select(), [made]);

  const revoke = async t => {
    if (armed !== t.id) return setArmed(t.id);
    await post(`/admin/tokens/${t.id}/revoke`);
    setArmed(null);
    reload();
  };
  const create = async e => {
    e.preventDefault();
    const r = await post('/admin/tokens', { name });
    if (!r.ok) return alert(r.body.error);
    setName('');
    setMade(r.body.token);
    setCopied(false);
    reload();
  };

  const dialog = useRef();
  const open = () => { setName(''); setMade(null); dialog.current.showModal(); };

  return html`<h2>Client tokens <button class="primary" style="margin-inline-start:auto" onClick=${open}>New token</button></h2>
  <div class="card table">
    <table>
      <thead><tr><th>Name</th><th>Created</th><th>Last used</th><th>Last IP</th><th></th></tr></thead>
      <tbody>${tokens.length ? tokens.map(t => html`<tr key=${t.id}><td>${t.name}</td><td>${when(t.created)}</td>
        <td>${t.last_used ? ago(t.last_used) : 'never'}</td><td>${t.last_ip ?? '-'}</td>
        <td><button class="danger" onClick=${() => revoke(t)}>${armed === t.id ? `Click again to revoke ${t.name}` : 'Revoke'}</button></td></tr>`)
        : html`<tr><td colspan="5" style="text-align:center;color:var(--muted)">No client tokens yet</td></tr>`}</tbody>
    </table>
  </div>
  <dialog ref=${dialog} aria-labelledby="t-title" onClose=${() => setMade(null)} onClick=${e => e.target === dialog.current && !made && dialog.current.close()}>
    <h2 id="t-title" style="margin:0 0 12px">${made ? 'Token created' : 'New client token'}</h2>
    ${made ? html`<div>
      <div class="k">Copy it now: it won’t be shown again.</div>
      <div class="filters" style="margin:8px 0 16px">
        <input readonly value=${made} style="flex:1;font-family:monospace" ref=${madeInput}/>
        <button type="button" onClick=${() => { navigator.clipboard.writeText(made); setCopied(true); }}>${copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div style="text-align:end"><button class="primary" onClick=${() => dialog.current.close()}>Done</button></div>
    </div>` : html`<form onSubmit=${create}>
      <label class="k" for="t-name">Name, so you can tell clients apart in the jobs list</label>
      <input id="t-name" required maxlength="60" placeholder="e.g. notewise-prod" autofocus style="display:block;width:100%;margin:6px 0 16px"
        value=${name} onInput=${e => setName(e.target.value)}/>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button type="button" class="ghost" onClick=${() => dialog.current.close()}>Cancel</button>
        <button class="primary">Create token</button>
      </div>
    </form>`}
  </dialog>`;
}
