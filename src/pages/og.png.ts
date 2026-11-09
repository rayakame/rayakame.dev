import type { APIRoute } from 'astro';
import { renderOgImage } from '../lib/og';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('og.png needs `site` in astro.config.mjs for the domain it shows');
  return new Response(renderOgImage(site.host), { headers: { 'Content-Type': 'image/png' } });
};
