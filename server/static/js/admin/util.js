export const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const when = t => new Date(t * 1000).toLocaleString('en-GB');
export const ago = t => {
  const s = Math.max(0, Date.now() / 1000 - t);
  return s < 60 ? 'just now' : [[86400, 'd'], [3600, 'h'], [60, 'm']].map(([n, u]) => s >= n && Math.floor(s / n) + u + ' ago').find(Boolean);
};
export const kb = b => (b / 1024).toFixed(0) + ' KB';
export const dur = s => [[86400, 'd'], [3600, 'h'], [60, 'm']].reduce((o, [n, u]) => s >= n || o ? o + Math.floor(s / n) + u + ' ' : o, '').trim() || s + 's';
export const statusOf = j => j.error ? 'error' : j.seconds == null ? 'running' : j.incomplete ? 'incomplete' : 'ok';
export const FLAG_LABEL = { boxes_off_column: 'Boxes on facing page', rows_no_box: 'Page rows without box', box_too_wide: 'Box too wide', replay_in_boxes: 'Repeated text in boxes',
  bad_chars_in_box: 'Junk characters in box', merged_paragraph: 'Paragraph in one line', no_lines: 'No lines' };
export const STATUS_LABEL = { ok: 'OK', incomplete: 'Cut short', error: 'Error', running: 'Running' };
