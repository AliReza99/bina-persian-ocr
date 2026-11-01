import { html } from '/vendor/htm-preact.js';
import { Card, Meter, Spark } from './Card.js';
import { css } from './util.js';

const gb = mb => (mb / 1024).toFixed(1);

export function Live({ state }) {
  const run = state.running, smp = state.samples, last = smp[smp.length - 1] || {};
  const col = k => smp.map(s => s[k]), acc = css('--accent'), s2 = css('--s2');
  return html`<h2>Live <small>last 10 min</small></h2>
  <div class="grid">
    <${Card} k="Queue" v=${html`${state.waiting}<small> / ${state.max_waiting}</small>`}>
      <${Meter} pct=${state.waiting / state.max_waiting * 100}/>
      <div class="sub">${run ? `#${run.id} · ${run.client}` : 'idle'}</div>
    <//>
    ${last.gpu_total_mb ? html`<${Card} k="GPU mem" v=${html`${gb(last.gpu_used_mb)}<small> / ${gb(last.gpu_total_mb)} GB</small>`}>
      <${Spark} values=${col('gpu_used_mb')} color=${acc}/><//>` : null}
    ${last.gpu_load != null ? html`
      <${Card} k="GPU util" v=${html`${last.gpu_load}<small>%</small>`}><${Spark} values=${col('gpu_load')} color=${acc}/><//>
      <${Card} k="GPU temp" v=${html`${last.gpu_temp}<small>°C</small>`}>
        <${Spark} values=${col('gpu_temp')} color=${css(last.gpu_temp >= 80 ? '--err' : '--inc')}/><//>` : null}
    <${Card} k="CPU" v=${last.cpu == null ? '-' : html`${last.cpu}<small>%</small>`}><${Spark} values=${col('cpu')} color=${s2}/><//>
    <${Card} k="RSS" v=${last.rss_mb == null ? '-' : html`${gb(last.rss_mb)}<small> GB</small>`}><${Spark} values=${col('rss_mb')} color=${s2}/><//>
  </div>`;
}
