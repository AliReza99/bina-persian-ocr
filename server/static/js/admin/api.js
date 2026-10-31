import { useEffect, useReducer, useState } from '/vendor/htm-preact.js';

export const get = url => fetch(url).then(res => res.json());

export async function post(url, body) {
  const res = await fetch(url, { method: 'POST',
    ...(body !== undefined && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
  return { ok: res.ok, body: await res.json().catch(() => ({})) };
}

// load() now and every ms; again when deps change or reload() is called. A failed poll keeps the last data.
export function usePoll(load, ms, deps = []) {
  const [data, setData] = useState(null);
  const [n, reload] = useReducer(x => x + 1, 0);
  useEffect(() => {
    let live = true;
    const run = () => load().then(d => live && setData(d), () => {});
    run();
    const t = ms && setInterval(run, ms);
    return () => { live = false; clearInterval(t); };
  }, [...deps, n]);
  return [data, reload];
}
