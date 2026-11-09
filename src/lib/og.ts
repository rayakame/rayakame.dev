// Link preview image (1200×630): the index page's frame and lockup, drawn as
// SVG from the site config and rendered to PNG at build time.
import { accessSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { site, type Theme } from '../config/site';
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from './emblem';
import { CLUSTERS } from './honeycomb';

const WIDTH = 1200;
const HEIGHT = 630;

// Mirrors the tokens in src/styles/site.css.
const COLORS = { bg: '#050505', text: '#f0f0f0', dim: '#8a8a8a', line: '#222222', rule: '#3a3a3a' };
const ACCENTS: Record<Theme, { accent: string; dot: string }> = {
  default: { accent: '#ffffff', dot: '#ffffff' },
  accent: { accent: '#8b7bff', dot: '#b6ff3b' },
};

// resvg only takes font paths; these resolve against the project root that astro runs in.
const FONT_FILES = ['400', '500'].map((weight) => `src/assets/fonts/martian-mono-latin-${weight}-normal.ttf`);
const FONT_FAMILY = 'Martian Mono SemiExpanded';
// Martian Mono is monospaced, so text widths follow from the character count.
const ADVANCE = 0.7;
const CAP_HEIGHT = 0.8;

interface TextStyle {
  size: number;
  // Letter spacing in em, as in the CSS.
  tracking?: number;
  weight?: 400 | 500;
  fill: string;
}

const LABEL: TextStyle = { size: 12, tracking: 0.14, fill: COLORS.dim };
const FOOTER: TextStyle = { size: 11, tracking: 0.14, fill: COLORS.dim };
const NAME: TextStyle = { size: 20, weight: 500, fill: '#ffffff' };
const YEAR: TextStyle = { size: 10, tracking: 0.2, fill: COLORS.dim };
const ROLE: TextStyle = { size: 16, tracking: 0.18, fill: COLORS.text };
const TAGLINE: TextStyle = { ...ROLE, fill: COLORS.dim };
const HOST: TextStyle = { size: 23, tracking: 0.12, weight: 500, fill: COLORS.text };

const escape = (value: string) => value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Advance width including the letter spacing after the last glyph, like a CSS box.
const width = (value: string, { size, tracking = 0 }: TextStyle) => value.length * (ADVANCE + tracking) * size;

const text = (value: string, x: number, y: number, style: TextStyle, attrs = '') => {
  const { size, tracking = 0, weight = 400, fill } = style;
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking * size}" fill="${fill}"${attrs}>${escape(value)}</text>`;
};

const emblem = (x: number, y: number, size: number, fill: string) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${EMBLEM_VIEWBOX}" fill="${fill}">${EMBLEM_PATHS.map((d) => `<path d="${d}"/>`).join('')}</svg>`;

const mark = (x: number, y: number) =>
  `<path d="M${x} ${y - 6.5}v13M${x - 6.5} ${y}h13" stroke="#ffffff" stroke-opacity="0.55"/>`;

function spine(accent: string) {
  const center = 48;
  const letters = [...site.name.toUpperCase()];
  // Upright vertical text: a 1.2em glyph box plus the page's 0.32em letter spacing.
  const pitch = 1.52 * NAME.size;
  const capHeight = CAP_HEIGHT * NAME.size;
  const top = 306 - ((letters.length - 1) * pitch + capHeight) / 2;
  const name = letters.map((letter, i) =>
    text(letter, center, top + i * pitch + capHeight, NAME, ' text-anchor="middle"'),
  );
  const year = `<g transform="translate(${center - (CAP_HEIGHT * YEAR.size) / 2} 570) rotate(90)">${text(String(site.year), 0, 0, YEAR)}</g>`;
  return [emblem(32, 24, 32, accent), ...name, year].join('');
}

function bars(dot: string) {
  const location = site.location.toUpperCase();
  const coordinates = site.coordinates.toUpperCase();
  const coordinatesX = 1160 - width(coordinates, LABEL);
  let x = 136;
  const contacts = site.contacts
    .filter((c) => c.footer)
    .map((c) => {
      const label = c.label.toUpperCase();
      const out = text(label, x, 611, FOOTER);
      x += width(label, FOOTER) + 32;
      return out;
    });
  return [
    `<path d="M95.5 0V${HEIGHT}M96 56.5H${WIDTH}M96 581.5H${WIDTH}" stroke="${COLORS.line}"/>`,
    `<rect x="136" y="26" width="6" height="6" fill="${dot}"/>`,
    text(location, 152, 33, LABEL),
    text(coordinates, coordinatesX, 33, LABEL),
    ...contacts,
    mark(95.5, 56.5),
    mark(95.5, 581.5),
  ].join('');
}

function honeycomb(accent: string) {
  const { outline, filled } = CLUSTERS['top-right'];
  const polygons = (list: string[]) => list.map((points) => `<polygon points="${points}"/>`).join('');
  return (
    `<svg x="936" y="57" width="264" height="230" viewBox="280 0 264 230">` +
    `<g stroke="${accent}" stroke-width="1.5" fill="none" stroke-opacity="0.28">${polygons(outline)}</g>` +
    `<g fill="${accent}" fill-opacity="0.16">${polygons(filled)}</g>` +
    `</svg>`
  );
}

function lockup(accent: string, host: string) {
  const x = 408;
  const lines = [
    { value: site.role.toUpperCase(), baseline: 282, style: ROLE },
    { value: site.tagline.toUpperCase(), baseline: 315, style: TAGLINE },
  ].map(({ value, baseline, style }) => {
    const ruleStart = x + width(value, style) + 20;
    const ruleY = Math.floor(baseline - (CAP_HEIGHT * style.size) / 2) + 0.5;
    const rule = ruleStart < 1136 ? `<path d="M${ruleStart} ${ruleY}H1136" stroke="${COLORS.rule}"/>` : '';
    return text(value, x, baseline, style) + rule;
  });
  return [emblem(160, 219, 200, accent), ...lines, text(host, x, 368, HOST)].join('');
}

const scanlines =
  `<defs><pattern id="scan" width="${WIDTH}" height="3" patternUnits="userSpaceOnUse">` +
  `<rect width="${WIDTH}" height="1" fill="#ffffff" fill-opacity="0.035"/></pattern></defs>` +
  `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scan)"/>`;

/** Renders the preview as PNG; `host` is the domain shown under the lockup. */
export function renderOgImage(host: string): Uint8Array<ArrayBuffer> {
  // resvg leaves text out without an error when its font is missing.
  for (const file of FONT_FILES) accessSync(file);
  const { accent, dot } = ACCENTS[site.theme];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" font-family="${FONT_FAMILY}">` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>` +
    honeycomb(accent) +
    spine(accent) +
    bars(dot) +
    lockup(accent, host) +
    scanlines +
    `</svg>`;
  const png = new Resvg(svg, {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: FONT_FAMILY },
  })
    .render()
    .asPng();
  return new Uint8Array(png);
}
