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

  return html`<h2>Client tokens</h2>
  <div class="card table">
    <table>
      <thead><tr><th>Name</th><th>Created</th><th>Last used</th><th>Last IP</th><th></th></tr></thead>
      <tbody>${tokens.length ? tokens.map(t => html`<tr key=${t.id}><td>${t.name}</td><td>${when(t.created)}</td>
        <td>${t.last_used ? ago(t.last_used) : 'never'}</td><td>${t.last_ip ?? '-'}</td>
        <td><button class="danger" onClick=${() => revoke(t)}>${armed === t.id ? `Click again to revoke ${t.name}` : 'Revoke'}</button></td></tr>`)
        : html`<tr><td colspan="5" style="text-align:center;color:var(--muted)">No client tokens yet</td></tr>`}</tbody>
    </table>
    <form class="filters" style="padding:10px;margin:0" onSubmit=${create}>
      <input required maxlength="60" placeholder="Name, e.g. notewise-prod" aria-label="Token name" style="width:240px"
        value=${name} onInput=${e => setName(e.target.value)}/>
      <button class="primary">Create token</button>
    </form>
    ${made && html`<div style="padding:0 10px 10px">
      <div class="k">Copy it now: it won’t be shown again.</div>
      <div class="filters" style="margin:6px 0 0">
        <input readonly value=${made} style="width:min(100%, 520px);font-family:monospace" ref=${madeInput}/>
        <button type="button" onClick=${() => { navigator.clipboard.writeText(made); setCopied(true); }}>${copied ? 'Copied' : 'Copy'}</button>
        <button type="button" onClick=${() => setMade(null)}>Done</button>
      </div>
    </div>`}
  </div>`;
}
