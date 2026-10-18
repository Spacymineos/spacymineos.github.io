const ORG = 'Spacymineos';
const API = `https://api.github.com/orgs/${ORG}/repos?per_page=100&sort=updated`;
const HIDDEN = new Set(['.github', `${ORG.toLowerCase()}.github.io`]);
const CACHE_KEY = 'spacymineos-repos';
const CACHE_MS = 10 * 60 * 1000;

const LANG_COLORS = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#8f7cf0',
  'C++': '#f34b7d', C: '#8a8a8a', Dart: '#2ec4b6', Python: '#4b8bbe', Java: '#e76f51',
  Go: '#00add8', Rust: '#dea584', Shell: '#89e051', Kotlin: '#a97bff', Swift: '#ff7043'
};

const $ = id => document.getElementById(id);
const listEl = $('list'), summaryEl = $('summary'), searchEl = $('search'), chipsEl = $('chips');
const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const state = { repos: [], lang: null, sort: 'updated', query: '' };

const escapeHtml = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

const ARROW = '<svg class="go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

function readCache() {
  try {
    const { at, data } = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    return Date.now() - at < CACHE_MS ? data : null;
  } catch { return null; }
}
function writeCache(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch {}
}

async function load() {
  listEl.innerHTML = [0, 1, 2].map(i => `<div class="skeleton" style="--i:${i}"></div>`).join('');
  try {
    let data = readCache();
    if (!data) {
      const res = await fetch(API, { headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(res.status === 403 ? 'GitHub rate limit reached' : `GitHub returned ${res.status}`);
      data = await res.json();
      writeCache(data);
    }
    state.repos = data.filter(r => !HIDDEN.has(r.name));
    $('fetched').textContent = `Fetched ${dateFmt.format(new Date())}`;
    renderSummary();
    renderChips();
    render(true);
  } catch (err) {
    summaryEl.textContent = 'Repositories unavailable.';
    chipsEl.innerHTML = '';
    listEl.innerHTML = `
      <div class="state error">
        <p>Could not load the list: ${escapeHtml(err.message)}.</p>
        <p>The same projects are on the <a href="https://github.com/${ORG}">organization page</a>.</p>
        <button class="btn" type="button" id="retry">Try again</button>
      </div>`;
    $('retry').addEventListener('click', load);
  }
}

function renderSummary() {
  const { repos } = state;
  const archived = repos.filter(r => r.archived).length;
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const parts = [`<strong>${plural(repos.length, 'repository', 'repositories')}</strong>`];
  parts.push(archived === repos.length ? 'all archived' : `${archived} archived`);
  if (stars) parts.push(plural(stars, 'star'));
  summaryEl.innerHTML = parts.join(', ');
}

function renderChips() {
  const counts = new Map();
  state.repos.forEach(r => r.language && counts.set(r.language, (counts.get(r.language) || 0) + 1));
  const langs = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (langs.length < 2) { chipsEl.innerHTML = ''; return; }
  const chip = (value, label, n) =>
    `<button class="chip" type="button" data-lang="${escapeHtml(value)}" aria-pressed="${state.lang === (value || null)}">${escapeHtml(label)}<small>${n}</small></button>`;
  chipsEl.innerHTML = chip('', 'All', state.repos.length) + langs.map(([l, n]) => chip(l, l, n)).join('');
}

function visible() {
  const q = state.query.trim().toLowerCase();
  return state.repos
    .filter(r => !state.lang || r.language === state.lang)
    .filter(r => !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.language || '').toLowerCase().includes(q))
    .sort((a, b) => state.sort === 'name'
      ? a.name.localeCompare(b.name)
      : new Date(b.updated_at) - new Date(a.updated_at));
}

function render(animate = false) {
  const repos = visible();
  listEl.classList.toggle('enter', animate);

  if (!repos.length) {
    listEl.innerHTML = `
      <div class="state">
        <p>Nothing matches that search.</p>
        <button class="chip" type="button" id="clear">Clear search and filters</button>
      </div>`;
    $('clear').addEventListener('click', reset);
    return;
  }

  listEl.innerHTML = repos.map((repo, i) => {
    const flags = [];
    if (!repo.archived) flags.push('<span class="flag live">Still active</span>');
    if (repo.fork) flags.push('<span class="flag">Fork</span>');
    const lang = repo.language
      ? `<span class="repo-lang"><span class="dot" style="--dot:${LANG_COLORS[repo.language] || 'var(--ink-soft)'}"></span>${escapeHtml(repo.language)}</span>`
      : '<span class="repo-lang"></span>';
    const desc = repo.description ? `<span class="repo-desc">${escapeHtml(repo.description)}</span>` : '';
    return `
      <a class="repo" style="--i:${Math.min(i, 10)}" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">
        <span class="repo-main">
          <span class="repo-name">${escapeHtml(repo.name)}${flags.length ? `<span class="repo-flags">${flags.join('')}</span>` : ''}</span>
          ${desc}
        </span>
        ${lang}
        <time class="repo-date" datetime="${escapeHtml(repo.updated_at)}">${dateFmt.format(new Date(repo.updated_at))}</time>
        ${ARROW}
      </a>`;
  }).join('');
}

function reset() {
  state.query = ''; state.lang = null; searchEl.value = '';
  renderChips(); render();
}

searchEl.addEventListener('input', () => { state.query = searchEl.value; render(); });

chipsEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-lang]');
  if (!btn) return;
  state.lang = btn.dataset.lang || null;
  renderChips(); render();
});

document.querySelector('.sort').addEventListener('click', e => {
  const btn = e.target.closest('[data-sort]');
  if (!btn) return;
  state.sort = btn.dataset.sort;
  document.querySelectorAll('[data-sort]').forEach(b => b.setAttribute('aria-pressed', b === btn));
  render();
});

document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); searchEl.focus(); }
  if (e.key === 'Escape' && document.activeElement === searchEl) { searchEl.value = ''; state.query = ''; render(); searchEl.blur(); }
});

load();
