// Site-wide text and contact details. Everything the pages show that is not a
// project comes from here.
export const site = {
  /** Written vertically in the spine and used in the page titles. */
  name: 'Christopher',
  /** Shown in the spine and in the footer copyright. */
  year: 2026,

  /** GitHub user name: the @handle on the index page and the default project owner derive from it. */
  github: 'rayakame',

  /**
   * Links in the footer, left to right. Add or remove entries freely; the
   * label is shown uppercase. Examples:
   *   { label: 'Mastodon', href: 'https://mastodon.social/@you' }
   *   { label: 'Discord', href: 'https://discord.com/users/…' }
   *   { label: 'CV', href: '/cv.pdf' }
   */
  contacts: [
    { label: 'GitHub', href: 'https://github.com/rayakame' },
    { label: 'Mail', href: 'mailto:mail@rayakame.dev' },
    { label: 'Discord', href: 'https://discord.com/users/1190760564000030741' },
  ],

  /** Top-bar status on the index page (desktop only) and the coordinates bottom right. */
  location: 'Munich, DE',
  coordinates: '48.10 N · 11.53 E',

  /** The two lockup lines on the index page; the second one has a shorter mobile variant. */
  role: 'Software Developer',
  tagline: 'Go · Python · Self-hosted',
  taglineMobile: 'Go · Python · Munich',

  bio: 'I write Go and Python, study electrical engineering and information technology at TUM, build and maintain open source software, and self-host a growing stack at home.',
};

export const githubUrl = `https://github.com/${site.github}`;
