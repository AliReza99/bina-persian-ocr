import { html, render, useEffect, useReducer, useState } from '/vendor/htm-preact.js';
import { get, post, usePoll } from './api.js';
import { Controls } from './Controls.js';
import { Header } from './Header.js';
import { Jobs } from './Jobs.js';
import { Live } from './Live.js';
import { Tokens } from './Tokens.js';
import { Trends } from './Trends.js';

const dark = matchMedia('(prefers-color-scheme: dark)');

function App() {
  const [range, setRange] = useState('24h');
  const [theme, setTheme] = useState(dark.matches);
  useEffect(() => { dark.onchange = e => setTheme(e.matches); }, []);
  const [state, refresh] = usePoll(() => get('/api/admin/state'), 2000);
  const [series, reloadSeries] = usePoll(() => get('/api/admin/series?range=' + range), 15000, [range]);
  const [tick, bump] = useReducer(x => x + 1, 0);
  const cleared = () => { reloadSeries(); bump(); };

  if (!state) return null;
  // key: a theme switch remounts everything so charts and colors re-read the CSS variables
  return html`<div key=${theme}>
    <${Header} state=${state}/>
    <main>
      <div class="top">
        <section><h2>Controls</h2><${Controls} state=${state} refresh=${refresh}/></section>
        <${Tokens}/>
      </div>
      <${Live} state=${state}/>
      ${series && html`<${Trends} d=${series} range=${range} setRange=${setRange}/>`}
      <${Jobs} tick=${tick}><${Clear} done=${cleared}/><//>
    </main>
  </div>`;
}

// two-step confirm instead of a blocking dialog
function Clear({ done }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  const click = async () => {
    if (!armed) return setArmed(true);
    setArmed(false);
    await post('/api/admin/clear');
    done();
  };
  return html`<button onClick=${click}>${armed ? 'Click again: delete all jobs' : 'Clear history'}</button>`;
}

render(html`<${App}/>`, document.getElementById('app'));
