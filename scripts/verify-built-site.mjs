import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const htmlPath = path.join(dist, 'index.html');
assert.ok(existsSync(htmlPath), 'Astro must emit dist/index.html');

const html = readFileSync(htmlPath, 'utf8');
const head = html.match(/<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const body = html.match(/<body(?:\s[^>]*)?>([\s\S]*?)<\/body>/i)?.[1] ?? '';

assert.match(head, /<title>[^<]+<\/title>/i);
assert.match(head, /<meta[^>]+name=["']description["']/i);
assert.match(head, /<link[^>]+rel=["']canonical["'][^>]+https:\/\//i);
assert.match(head, /<link[^>]+rel=["']icon["'][^>]+favicon\.svg/i);
assert.ok(/<style(?:\s|>)/i.test(head) || /<link[^>]+rel=["']stylesheet["']/i.test(head));
assert.ok(body.trim().length > 1000, 'built body is unexpectedly small');
assert.doesNotMatch(html, /(?:src|href)=["'][^"']*\/src\//i);
assert.doesNotMatch(html, /undefined|\$\{/);

const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]));
for (const [, fragment] of html.matchAll(/href=["']#([^"']+)["']/gi)) {
  assert.ok(ids.has(fragment), `missing target for #${fragment}`);
}

for (const ref of html.matchAll(/(?:href|src)=["'](\/[^"'?#]*)/gi)) {
  const clean = ref[1].replace(/^\/+/, '');
  if (!clean) continue;
  const candidates = [
    path.join(dist, clean),
    path.join(dist, clean, 'index.html'),
    path.join(dist, `${clean}.html`),
  ];
  assert.ok(candidates.some(existsSync), `broken same-site artifact reference: ${ref[1]}`);
}

for (const required of ['favicon.svg', 'robots.txt', 'sitemap-index.xml']) {
  assert.ok(existsSync(path.join(dist, required)), `missing dist/${required}`);
}

console.log('Verified built Astro marketing artifact.');
