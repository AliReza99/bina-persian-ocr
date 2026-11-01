import { html, render, useEffect, useReducer, useState } from '/vendor/htm-preact.js';
import { get, post, usePoll } from './api.js';
import { Controls } from './Controls.js';
import { Header } from './Header.js';
import { Jobs } from './Jobs.js';
import { Live } from './Live.js';
import { Tiles } from './Tiles.js';
import { Tokens } from './Tokens.js';
import { Trends } from './Trends.js';

const dark = matchMedia('(prefers-color-scheme: dark)');

function App() {
  const [range, setRange] = useState('24h');
  const [theme, setTheme] = useState(dark.matches);
  useEffect(() => { dark.onchange = e => setTheme(e.matches); }, []);
  const [state, refresh] = usePoll(() => get('/api/admin/state'), 2000);
  const [day, reloadDay] = usePoll(() => get('/api/admin/series?range=24h'), 15000);
  const [series, reloadSeries] = usePoll(() => get('/api/admin/series?range=' + range), 15000, [range]);
  const [tick, bump] = useReducer(x => x + 1, 0);
  const cleared = () => { reloadDay(); reloadSeries(); bump(); };

  if (!state) return null;
  // key: a theme switch remounts everything so charts and colors re-read the CSS variables
  return html`<main key=${theme}>
    <${Header} state=${state}/>
    <${Controls} state=${state} refresh=${refresh}/>
    <${Live} state=${state}/>
    ${day && html`<${Tiles} stats=${state.stats} d=${day}/>`}
    ${series && html`<${Trends} d=${series} range=${range} setRange=${setRange}/>`}
    <${Jobs} clients=${series?.clients || []} tick=${tick}><${Clear} done=${cleared}/><//>
    <${Tokens}/>
  </main>`;
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
  return html`<button class="danger" onClick=${click}>${armed ? 'Click again to delete all jobs and thumbnails' : 'Clear history'}</button>`;
}

render(html`<${App}/>`, document.getElementById('app'));
