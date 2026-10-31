import { html } from '/vendor/htm-preact.js';
import { Card, Meter, Spark } from './Card.js';
import { css } from './util.js';

export function Live({ state }) {
  const run = state.running, smp = state.samples, last = smp[smp.length - 1] || {};
  const col = k => smp.map(s => s[k]), acc = css('--accent'), s2 = css('--s2');
  return html`<h2>Live, while this page is open (up to 10 minutes)</h2>
  <div class="grid">
    <${Card} key="queue" k="Queue" v=${html`${state.waiting} <small>/ ${state.max_waiting} waiting</small>`}>
      <${Meter} pct=${state.waiting / state.max_waiting * 100}/>
      <div class="k" style="margin-top:8px">${run ? 'Running: ' + run.client : 'Model idle'}</div>
    <//>
    ${last.gpu_total_mb ? html`<${Card} key="gmem" k="GPU memory"
        v=${html`${(last.gpu_used_mb / 1024).toFixed(1)} <small>/ ${(last.gpu_total_mb / 1024).toFixed(1)} GB</small>`}>
      <${Meter} pct=${last.gpu_used_mb / last.gpu_total_mb * 100}/><${Spark} values=${col('gpu_used_mb')} color=${acc}/>
    <//>` : null}
    ${last.gpu_load != null ? html`
      <${Card} key="gload" k="GPU load" v=${html`${last.gpu_load}<small>%</small>`}><${Spark} values=${col('gpu_load')} color=${acc}/><//>
      <${Card} key="gtemp" k="GPU temperature" v=${html`${last.gpu_temp}<small>°C</small>`}>
        <${Spark} values=${col('gpu_temp')} color=${css(last.gpu_temp >= 80 ? '--err' : '--inc')}/><//>` : null}
    <${Card} key="cpu" k="Process CPU" v=${last.cpu == null ? '-' : html`${last.cpu}<small>%</small>`}><${Spark} values=${col('cpu')} color=${s2}/><//>
    <${Card} key="ram" k="Process RAM" v=${last.rss_mb == null ? '-' : html`${(last.rss_mb / 1024).toFixed(2)} <small>GB</small>`}>
      <${Spark} values=${col('rss_mb')} color=${s2}/><//>
  </div>`;
}
