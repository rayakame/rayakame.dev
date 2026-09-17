# rayakame.dev

Personal site of Christopher, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Pages

- `/` — index with the lockup and a short bio
- `/about/` — profile, current work, stack, self-hosted services and a live spec readout
- `/projects/` — configured projects, with missing fields filled from the GitHub API at build time and refreshed in the browser

## Configuration

All copy and lists live in `src/config/`:

| File          | Contents                                                   |
| ------------- | ---------------------------------------------------------- |
| `site.ts`     | name, GitHub handle, location, lockup lines, bio, contacts |
| `about.ts`    | about page sections and the spec readout                   |
| `projects.ts` | the project list; see the comments there for the format    |

## Development

```sh
npm install
npm run dev      # local server at http://localhost:4321
npm run build    # static output in dist/
npm run ci       # format check, lint, type check, build
```

Requires Node 22.12 or newer. Pushes to `main` deploy via `.github/workflows/deploy.yml`; a daily run keeps the project data fresh.

## License

[MIT](LICENSE)
