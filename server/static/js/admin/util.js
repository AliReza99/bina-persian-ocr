export const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const when = t => new Date(t * 1000).toLocaleString('en-GB');
export const ago = t => {
  const s = Math.max(0, Date.now() / 1000 - t);
  return s < 60 ? 'just now' : [[86400, 'd'], [3600, 'h'], [60, 'm']].map(([n, u]) => s >= n && Math.floor(s / n) + u + ' ago').find(Boolean);
};
export const kb = b => (b / 1024).toFixed(0) + ' KB';
export const dur = s => [[86400, 'd'], [3600, 'h'], [60, 'm']].reduce((o, [n, u]) => s >= n || o ? o + Math.floor(s / n) + u + ' ' : o, '').trim() || s + 's';
export const statusOf = j => j.error ? 'error' : j.seconds == null ? 'running' : j.incomplete ? 'incomplete' : 'ok';
export const STATUS_LABEL = { ok: 'OK', incomplete: 'Cut short', error: 'Error', running: 'Running' };
