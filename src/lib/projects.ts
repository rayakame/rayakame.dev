// Project list: the config is the only source of truth. Entries that name a
// GitHub repository get their missing fields from the API; fields set in the
// config always win. Used at build time (src/pages/projects.astro) and in the
// browser (src/scripts/projects.ts).

export interface Project {
  name: string;
  url: string;
  desc: string | null;
  lang: string | null;
  stars: number | null;
  /** ISO date or date-time; rendered as YYYY-MM-DD. */
  pushed: string | null;
}

interface ProjectFields {
  /** Display name; defaults to the repository name. */
  name?: string;
  /** Link target; defaults to the repository's GitHub page. */
  url?: string;
  desc?: string | null;
  lang?: string | null;
  stars?: number | null;
  /** ISO date such as '2026-09-15'. */
  pushed?: string | null;
}

/**
 * One configured project. With `repo` (`name` or `owner/name`), every field
 * left out is fetched from GitHub. Without `repo` nothing is fetched, so
 * `name` and `url` are required.
 */
export type ProjectConfig =
  ({ repo: string } & ProjectFields) | ({ repo?: undefined; name: string; url: string } & ProjectFields);

export interface ProjectsConfig {
  /** Default owner for `repo` entries written without one. */
  user: string;
  projects: ProjectConfig[];
}

/** Fetched repositories keyed by lowercase `owner/name`. */
export type GitHubData = Record<string, Project>;

/** One rendered row; missing values are already replaced by a dash. */
export interface Row {
  no: string;
  name: string;
  desc: string;
  lang: string;
  stars: string;
  pushed: string;
  url: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
}

const API = 'https://api.github.com';
const DASH = '—';

const clean = (repo: string): string => repo.trim().replace(/\/+$/, '');
const fullName = (repo: string, user: string): string =>
  clean(repo).includes('/') ? clean(repo) : `${user}/${clean(repo)}`;
const repoName = (full: string): string => full.split('/').pop() ?? full;
const key = (full: string): string => full.toLowerCase();

/** Only fetch when a displayable field is missing from the config. */
const needsFetch = (p: ProjectConfig): boolean =>
  p.repo !== undefined &&
  (p.desc === undefined || p.lang === undefined || p.stars === undefined || p.pushed === undefined);

/** Full names of every configured repository that needs data from GitHub, in config order. */
export function wantedRepos(config: ProjectsConfig): string[] {
  return config.projects.filter(needsFetch).map((p) => fullName(p.repo as string, config.user));
}

function fromGitHub(r: GitHubRepo): Project {
  return {
    name: r.name,
    url: r.html_url,
    desc: r.description,
    lang: r.language,
    stars: r.stargazers_count,
    pushed: r.pushed_at,
  };
}

/**
 * Fetch the configured repositories: one list request for the user's own repos,
 * then one request per repository not covered by it (other owners, or beyond the
 * first 100). Throws if the list request fails. A single repository that cannot
 * be fetched is left out of the result (its row shows the config fields and
 * dashes), unless `strict` is set, in which case the error propagates so the
 * browser never replaces good rows with a partial result.
 */
export async function fetchGitHubData(
  config: ProjectsConfig,
  options: { token?: string; fetch?: typeof fetch; strict?: boolean } = {},
): Promise<GitHubData> {
  const wanted = wantedRepos(config);
  const data: GitHubData = {};
  if (wanted.length === 0) return data;

  const fetchImpl = options.fetch ?? fetch;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const api = async <T>(path: string): Promise<T> => {
    const res = await fetchImpl(`${API}${path}`, { headers });
    if (!res.ok) throw Object.assign(new Error(`GitHub API ${res.status} for ${path}`), { status: res.status });
    return (await res.json()) as T;
  };

  const ownPrefix = `${config.user.toLowerCase()}/`;
  if (wanted.some((full) => key(full).startsWith(ownPrefix))) {
    const list = await api<GitHubRepo[]>(`/users/${config.user}/repos?per_page=100&sort=pushed`);
    if (!Array.isArray(list)) throw new Error('GitHub API returned an unexpected payload for the repository list');
    for (const r of list) data[key(r.full_name)] = fromGitHub(r);
  }

  const rest = wanted.filter((full) => !(key(full) in data));
  await Promise.all(
    rest.map(async (full) => {
      try {
        data[key(full)] = fromGitHub(await api<GitHubRepo>(`/repos/${full}`));
      } catch (err) {
        if (options.strict) throw err;
        console.warn(`[projects] could not fetch ${full}, showing configured fields only:`, err);
      }
    }),
  );

  // Only keep what was asked for, so the cache stays small.
  const result: GitHubData = {};
  for (const full of wanted) {
    const repo = data[key(full)];
    if (repo) result[key(full)] = repo;
  }
  return result;
}

/** Merge each config entry over its fetched data, in config order. Fields set in the config win. */
export function resolveProjects(config: ProjectsConfig, data: GitHubData): Project[] {
  return config.projects.map((p) => {
    const full = p.repo !== undefined ? fullName(p.repo, config.user) : null;
    const fetched = full ? data[key(full)] : undefined;
    const base: Project = fetched ?? {
      name: full ? repoName(full) : (p.name as string),
      url: full ? `https://github.com/${full}` : (p.url as string),
      desc: null,
      lang: null,
      stars: null,
      pushed: null,
    };
    const { repo: _repo, ...fields } = p;
    const override = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    return { ...base, ...override };
  });
}

/** What to show when GitHub cannot be reached: config fields only, dashes elsewhere. */
export function fallbackProjects(config: ProjectsConfig): Project[] {
  return resolveProjects(config, {});
}

export function toRows(projects: Project[]): Row[] {
  return projects.map((p, i) => ({
    no: String(i + 1).padStart(2, '0'),
    name: p.name,
    desc: p.desc || DASH,
    lang: p.lang || DASH,
    stars: p.stars == null ? DASH : String(p.stars),
    pushed: p.pushed ? p.pushed.slice(0, 10) : DASH,
    url: p.url,
  }));
}
