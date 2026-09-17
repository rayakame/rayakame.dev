// Project list. Only what is listed here is shown, in this order.
//
// Two kinds of entry:
//   { repo: 'name' }             GitHub repository under GITHUB_USER; `owner/name` for another
//                                owner. Every field you leave out (desc, lang, stars, pushed)
//                                is fetched from GitHub; every field you set wins.
//   { name, url, ... }           no `repo`: nothing is fetched, e.g. closed-source work.
//                                `name` and `url` are required, the rest optional.
//
// Fields: name (display name, defaults to the repository name), url (link target,
// defaults to the GitHub page), desc, lang, stars, pushed ('2026-09-15').
import type { ProjectConfig, ProjectsConfig } from '../lib/projects';
import { site } from './site';

/** Default owner for `repo` entries without one; set in src/config/site.ts. */
export const GITHUB_USER = site.github;

export const PROJECTS: ProjectConfig[] = [
  { repo: 'hikari-py/hikari' },
  { repo: 'sqlc-gen-better-python', lang: 'Go & Python' },
  { repo: 'sqlc-bin' },
  { repo: 'radixly', url: 'https://radixly.rayakame.dev', lang: 'C & Python' },
  { repo: 'hikari-risa' },
  { repo: 'roomsense' },
  // { name: 'act-backend', url: 'https://…', desc: 'Go/Fiber backend for a fitness social app.', lang: 'Go' },
];

export const projectsConfig: ProjectsConfig = { user: GITHUB_USER, projects: PROJECTS };
