const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, mkdir, writeFile, rm, readFile } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const express = require('express');
const { registerAdminPwaPage } = require('./pwaPages');

const customerHtml = '<!doctype html><html><head><title>Mak Delivery</title><link rel="manifest" href="/manifest.json"/><meta name="apple-mobile-web-app-title" content="Mak Delivery"/><link rel="apple-touch-icon" href="/delivery-truck.png"/><link rel="icon" href="/delivery-truck.png"/><script src="/static/js/app.js" defer></script></head><body><div id="root"></div></body></html>';
let build, server, base;
before(async () => {
  build = await mkdtemp(path.join(os.tmpdir(), 'mak-admin-pwa-test-'));
  await mkdir(path.join(build, 'admin'));
  await writeFile(path.join(build, 'index.html'), customerHtml);
  const publicDir = path.join(__dirname, '../../static/public');
  for (const name of ['manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png']) {
    await writeFile(path.join(build, 'admin', name), await readFile(path.join(publicDir, 'admin', name)));
  }
  await writeFile(path.join(build, 'manifest.json'), await readFile(path.join(publicDir, 'manifest.json')));
  const app = express();
  registerAdminPwaPage(app, build);
  app.use(express.static(build));
  app.get('*', (req, res) => res.sendFile(path.join(build, 'index.html')));
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (build) {
    assert.equal(path.dirname(path.resolve(build)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(build).startsWith('mak-admin-pwa-test-'));
    await rm(build, { recursive: true, force: true });
  }
});

test('admin canonical redirect preserves query and does not loop with trailing slash', async () => {
  const response = await fetch(`${base}/admin?tab=orders&value=a%20b`, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/admin/?tab=orders&value=a%20b');
  assert.equal((await fetch(`${base}/admin/?tab=orders`, { redirect: 'manual' })).status, 200);
  const head = await fetch(`${base}/admin`, { method: 'HEAD', redirect: 'manual' });
  assert.equal(head.status, 308);
});

test('initial admin HTML advertises distinct app before JavaScript runs', async () => {
  const response = await fetch(`${base}/admin/`);
  const html = await response.text();
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(html, /<title>Mak Delivery Admin<\/title>/);
  assert.match(html, /name="apple-mobile-web-app-title" content="Mak Delivery Admin"/);
  assert.match(html, /rel="apple-touch-icon" href="\/admin\/icon-180.png"/);
  assert.match(html, /rel="icon" href="\/admin\/icon-192.png"/);
  assert.match(html, /rel="manifest" href="\/admin\/manifest.json"/);
  assert.equal((html.match(/rel="manifest"/g) || []).length, 1);
  assert.ok(html.indexOf('/admin/manifest.json') < html.indexOf('<script'));
});

test('customer HTML and manifest retain original home-page identity', async () => {
  for (const route of ['/', '/restaurants', '/administrator']) {
    assert.equal(await (await fetch(base + route)).text(), customerHtml);
  }
  const manifest = await (await fetch(`${base}/manifest.json`)).json();
  assert.equal(manifest.id, '/');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.name, 'Mak Delivery');
});

test('admin manifest and raster icons are real assets and its launch is within scope', async () => {
  const response = await fetch(`${base}/admin/manifest.json`);
  assert.match(response.headers.get('content-type'), /json/);
  const manifest = await response.json();
  assert.equal(manifest.id, '/admin/');
  assert.equal(manifest.start_url, '/admin/');
  assert.equal(manifest.scope, '/admin/');
  assert.equal(manifest.name, 'Mak Delivery Admin');
  for (const size of [180, 192, 512]) {
    const icon = await fetch(`${base}/admin/icon-${size}.png`);
    assert.match(icon.headers.get('content-type'), /image\/png/);
    const bytes = Buffer.from(await icon.arrayBuffer());
    assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
    assert.equal(bytes.readUInt32BE(16), size);
    assert.equal(bytes.readUInt32BE(20), size);
  }
});
