// Builds /sitemap.xml at build time so Google can find every page.
// No plugin needed: it's just a list of URLs. New hats in hats.json
// are added automatically.
import { hats } from '../lib/hats.js';

const pages = ['/', '/collection/', '/about/', '/contact/', '/sizing/', '/privacy/', '/cookies/', '/terms/'];

export function GET({ site }) {
  const urls = [...pages, ...hats.map((hat) => `/collection/${hat.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
