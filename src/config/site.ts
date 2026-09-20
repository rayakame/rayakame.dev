// Site-wide text and contact details. Everything the pages show that is not a
// project comes from here.

/** Accent palettes, defined as token blocks in src/styles/site.css. */
export type Theme = 'default' | 'accent';

/** One way to reach me. */
export interface Contact {
  /** Uppercase in the bottom bar, and the row label under 05 · Contact. */
  label: string;
  /** The address or handle itself. Shown on the About page only. */
  handle: string;
  href: string;
  /** Also put it in the bottom bar. See the note on `contacts` below. */
  footer?: boolean;
}

/**
 * Every way to reach me, in the order they are listed. All of them appear on
 * the About page under 05 · Contact; the ones marked `footer: true` also go in
 * the bottom bar.
 *
 * Keep the footer ones to about three. The bar has ~302px on a 390px phone and
 * does not wrap, so a fourth label pushes the copyright off-screen -- add new
 * channels without `footer` and they land on the About page only. Examples:
 *   { label: 'Mastodon', handle: '@you@mastodon.social', href: 'https://mastodon.social/@you' }
 *   { label: 'Matrix', handle: '@you:matrix.org', href: 'https://matrix.to/#/@you:matrix.org' }
 *   { label: 'CV', handle: 'PDF, 2 pages', href: '/cv.pdf' }
 */
const contacts: Contact[] = [
  { label: 'GitHub', handle: '@rayakame', href: 'https://github.com/rayakame', footer: true },
  { label: 'Mail', handle: 'mail@rayakame.dev', href: 'mailto:mail@rayakame.dev', footer: true },
  {
    label: 'Discord',
    handle: 'ray_akame',
    href: 'https://discord.com/users/1190760564000030741',
    footer: true,
  },
  {
    label: 'SimpleX',
    handle: 'Invite link',
    href: 'https://smp12.simplex.im/a#ZzvNKIEsL9a52fwn1llK_t2Uc_YRb1qHqYyaf1W-aEw',
    footer: false,
  },
];

export const site = {
  /** Written vertically in the spine and used in the page titles. */
  name: 'Christopher',
  /** Shown in the spine and in the footer copyright. */
  year: 2026,

  /**
   * Accent palette, baked in at build time as `data-theme` on <html>. There is
   * no switch on the page; this is the only place it is set.
   *   'default' -- white accent, white status dot
   *   'accent'  -- violet accent, lime status dot
   */
  theme: 'accent' as Theme,

  /** GitHub user name: the @handle on the index page and the default project owner derive from it. */
  github: 'rayakame',

  /** Defined above, so the shape stays type-checked. */
  contacts,

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
