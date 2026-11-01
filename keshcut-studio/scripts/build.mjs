// Zero-dependency build: checks every image reference, copies public/ to dist/, and fills in the site address and date.
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PLACEHOLDER = 'https://YOUR-DOMAIN.com';
const env = process.env;
let site = (env.SITE_URL || env.URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + env.VERCEL_PROJECT_PRODUCTION_URL : '') || env.CF_PAGES_URL || '').trim().replace(/\/+$/, '');
if (site && !/^https?:\/\//.test(site)) site = 'https://' + site;

// 1. every file the page points to must exist
const missing = [];
for (const f of ['index.html', 'css/styles.css', 'js/app.js', 'js/consent.js']) {
  const text = readFileSync(join('public', f), 'utf8');
  const refs = [...text.matchAll(/["'(](\/(?:images\/[^"')\s?#]+|videos\/[^"')\s?#]+|favicon\.ico|apple-touch-icon\.png|site-config\.js|css\/[^"')\s]+|js\/[^"')\s]+))/g)].map(m => m[1])
    .concat([...text.matchAll(/YOUR-DOMAIN\.com(\/[^"'<\s]+\.(?:jpg|png|ico))/g)].map(m => m[1]));
  for (const r of refs) if (!existsSync(join('public', r))) missing.push(`${f}: ${r}`);
}
if (missing.length) { console.error('Missing files referenced by the site:\n  ' + [...new Set(missing)].join('\n  ')); process.exit(1); }

// 2. copy and fill in
rmSync('dist', { recursive: true, force: true });
cpSync('public', 'dist', { recursive: true });
const today = new Date().toISOString().slice(0, 10);
for (const f of ['index.html', 'robots.txt', 'sitemap.xml', 'site-config.js']) {
  const p = join('dist', f);
  let t = readFileSync(p, 'utf8').replaceAll('__LASTMOD__', today);
  if (site) t = t.replaceAll(PLACEHOLDER, site);
  if (f === 'site-config.js' && env.GA_MEASUREMENT_ID) t = t.replace("gaMeasurementId: ''", `gaMeasurementId: '${env.GA_MEASUREMENT_ID.trim()}'`);
  writeFileSync(p, t);
}
console.log(site ? `Built dist/ for ${site}` : 'Built dist/. WARNING: no site address found. Set SITE_URL (for example https://www.example.com) so canonical links, sitemap and social previews use your real domain.');
