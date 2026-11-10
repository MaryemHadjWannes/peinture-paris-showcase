// Local smoke checks only: fake credentials, no R2/Google requests and no form submission.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { CITIES, SERVICES, cityPath } from '../src/data/seo';
import { getRouteMeta } from '../src/data/routeMeta';

const port = '5099';
const server = spawn(process.execPath, ['--import', 'tsx', 'server.ts'], {
  env: { ...process.env, PORT: port, JWT_SECRET: 'local-smoke-check-only', ADMIN_EMAIL: 'test@example.invalid',
    ADMIN_PASSWORD_HASH: '', ADMIN_PASSWORD: 'local-test-only', CORS_ORIGIN: `http://localhost:${port}`,
    R2_ACCOUNT_ID: 'local-test', R2_ACCESS_KEY_ID: 'local-test', R2_SECRET_ACCESS_KEY: 'local-test',
    R2_BUCKET_NAME: 'local-test', R2_PUBLIC_DOMAIN: 'https://example.invalid' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
try {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server startup timed out')), 15000);
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Server exited: ${code}`)); });
    server.stdout.on('data', chunk => {
      if (chunk.toString().includes('Server running')) { clearTimeout(timeout); resolve(); }
    });
  });
  const paths = [...new Set(['/', '/avis', '/realisations', ...CITIES.map(cityPath),
    ...CITIES.flatMap(city => SERVICES.map(service => `/${service.slug}/${city.slug}`))])];
  for (const pathname of paths) {
    const response = await fetch(`http://localhost:${port}${pathname}`);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    const meta = getRouteMeta(pathname)!;
    assert.ok(html.includes(`<title>${meta.title}</title>`), `Wrong initial title: ${pathname}`);
    assert.ok(html.includes(`rel="canonical" href="${meta.canonical}"`), `Wrong canonical: ${pathname}`);
    assert.equal((html.match(/name="description"/g) ?? []).length, 1, pathname);
  }
  const redirects = [['/cambrai-59400', '/'], ['/artisan-peintre-cambrai', '/artisan-peintre/cambrai-59400'],
    ['/ville/douai-59500/enduit', '/enduit/douai-59500'], ['/avis/', '/avis'], ['/index.html', '/'],
    ...SERVICES.map(service => [service.path, `/${service.slug}/${CITIES[0].slug}`])];
  for (const [from, to] of redirects) {
    const response = await fetch(`http://localhost:${port}${from}`, { redirect: 'manual' });
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), to, from);
  }
  for (const pathname of ['/missing', '/administrator', '/admin-fake', '/missing/cambrai-59400', '/enduit/missing']) {
    const response = await fetch(`http://localhost:${port}${pathname}`);
    assert.equal(response.status, 404, pathname);
    assert.ok((await response.text()).includes('noindex, nofollow'), pathname);
  }
  assert.equal((await fetch(`http://localhost:${port}/index.php`)).status, 410);
  console.log(`Server checks passed: ${paths.length} pages, ${redirects.length} redirects and 404/410 responses.`);
} finally {
  const exited = once(server, 'exit');
  server.kill();
  await exited;
}
