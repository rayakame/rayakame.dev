// Refreshes the project list from the GitHub API at load time, with a one-hour
// localStorage cache so the unauthenticated rate limit is never an issue. The
// rows rendered at build time stay in place if the fetch fails. Column headers
// sort the list; the default is the config order shown in the NO column.
import { projectsConfig } from '../config/projects';
import { fetchGitHubData, resolveProjects, toRows, wantedRepos, type GitHubData, type Row } from '../lib/projects';

const TTL = 60 * 60 * 1000;
const KEY = `projects:${wantedRepos(projectsConfig).join(',')}`;

const list = document.querySelector<HTMLElement>('[data-projects]');
const template = document.querySelector<HTMLTemplateElement>('#row-template');
const counter = document.querySelector<HTMLElement>('[data-repo-count]');
const sortButtons = [...document.querySelectorAll<HTMLButtonElement>('.list-head__sort[data-sort]')];
const builtRows = document.getElementById('projects-json')?.textContent ?? '';

type SortKey = 'no' | 'name' | 'lang' | 'stars' | 'pushed';
type Dir = 'asc' | 'desc';
const DEFAULT_DIR: Record<SortKey, Dir> = { no: 'asc', name: 'asc', lang: 'asc', stars: 'desc', pushed: 'desc' };

/** Rows in config order, as currently known (build-time, then refreshed). */
let current: Row[] = parseBuilt();
let sortKey: SortKey = 'no';
let sortDir: Dir = 'asc';

function parseBuilt(): Row[] {
  try {
    const rows = JSON.parse(builtRows);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

/** Missing values ('—') always sort last, whatever the direction. */
function compare(a: Row, b: Row, key: SortKey): number {
  if (key === 'no') return Number(a.no) - Number(b.no);
  if (key === 'stars') {
    const av = a.stars === '—' ? null : Number(a.stars);
    const bv = b.stars === '—' ? null : Number(b.stars);
    if (av === null || bv === null) return av === bv ? 0 : av === null ? 1 : -1;
    return av - bv;
  }
  const av = a[key] === '—' ? null : a[key];
  const bv = b[key] === '—' ? null : b[key];
  if (av === null || bv === null) return av === bv ? 0 : av === null ? 1 : -1;
  return av.localeCompare(bv, undefined, { sensitivity: 'base' });
}

function sorted(rows: Row[]): Row[] {
  const sign = sortDir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const [x, y] = sign === 1 ? [a, b] : [b, a];
    const missing = (r: Row) => (sortKey === 'no' ? false : r[sortKey] === '—');
    // Keep the "missing last" rule direction-independent.
    if (missing(a) !== missing(b)) return missing(a) ? 1 : -1;
    return compare(x, y, sortKey) || Number(a.no) - Number(b.no);
  });
}

function readCache(): GitHubData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: GitHubData };
    return Date.now() - at < TTL && data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: GitHubData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Storage unavailable (private mode, quota): the next visit simply fetches again.
  }
}

function sameAsBuilt(rows: Row[]): boolean {
  return JSON.stringify(parseBuilt()) === JSON.stringify(rows);
}

function setSort(key: SortKey): void {
  sortDir = key === sortKey ? (sortDir === 'asc' ? 'desc' : 'asc') : DEFAULT_DIR[key];
  sortKey = key;
  for (const button of sortButtons) {
    const active = button.dataset.sort === key;
    button.setAttribute('aria-pressed', String(active));
    if (active) button.dataset.dir = sortDir;
    else delete button.dataset.dir;
  }
  render(sorted(current));
}

for (const button of sortButtons) {
  button.addEventListener('click', () => setSort(button.dataset.sort as SortKey));
}

function render(rows: Row[]): void {
  if (!list || !template) return;
  const proto = template.content.firstElementChild;
  if (!proto) return;
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const node = proto.cloneNode(true) as HTMLAnchorElement;
    node.href = row.url;
    for (const field of ['no', 'name', 'desc', 'lang', 'stars', 'pushed'] as const) {
      const cell = node.querySelector(`.row__${field}`);
      if (cell) cell.textContent = row[field];
    }
    fragment.appendChild(node);
  }
  list.replaceChildren(fragment);
  if (counter) counter.textContent = String(rows.length).padStart(2, '0');
}

async function refresh(): Promise<void> {
  if (wantedRepos(projectsConfig).length === 0) return;
  let data = readCache();
  if (!data) {
    try {
      data = await fetchGitHubData(projectsConfig, { strict: true });
      writeCache(data);
    } catch (err) {
      console.warn('[projects] GitHub fetch failed, keeping the rows from the last build.', err);
      return;
    }
  }
  const rows = toRows(resolveProjects(projectsConfig, data));
  const changed = !sameAsBuilt(rows);
  current = rows;
  if (changed || sortKey !== 'no' || sortDir !== 'asc') render(sorted(current));
}

refresh();
