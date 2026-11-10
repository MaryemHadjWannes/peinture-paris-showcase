import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CITIES, SERVICES, cityPath } from '../src/data/seo';
import { getRouteMeta, SITE_URL } from '../src/data/routeMeta';

const paths = ['/', '/realisations', '/avis', ...CITIES.map(cityPath),
  ...CITIES.flatMap(city => SERVICES.map(service => `/${service.slug}/${city.slug}`))];
const canonicalPaths = [...new Set(paths)];
const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URL');
assert.deepEqual([...urls].sort(), canonicalPaths.map(path => `${SITE_URL}${path}`).sort(), 'Sitemap must contain exactly the public canonical routes');
const titles = new Set<string>();
for (const pathname of canonicalPaths) {
  const meta = getRouteMeta(pathname);
  assert.ok(meta?.description && meta.canonical && meta.ogImage, `Missing metadata: ${pathname}`);
  assert.equal(meta.canonical, `${SITE_URL}${pathname}`);
  assert.equal(meta.robots, 'index, follow');
  assert.ok(!titles.has(meta.title), `Duplicate title: ${meta.title}`);
  titles.add(meta.title);
  assert.ok(existsSync(`public${new URL(meta.ogImage).pathname}`), `Missing social image: ${meta.ogImage}`);
  for (const crumb of meta.breadcrumbs ?? []) assert.ok(getRouteMeta(new URL(crumb.url).pathname), `Broken breadcrumb: ${crumb.url}`);
}
for (const pathname of ['/missing', '/enduit/missing', '/missing/cambrai-59400', '/administrator', '/admin-fake', '/a/b/c']) {
  assert.equal(getRouteMeta(pathname), null, `Unknown route accepted: ${pathname}`);
}
assert.equal(getRouteMeta('/admin')?.robots, 'noindex, nofollow');
console.log(`SEO checks passed: ${canonicalPaths.length} canonical pages, ${CITIES.length} cities, ${CITIES.length * SERVICES.length} service pages.`);
