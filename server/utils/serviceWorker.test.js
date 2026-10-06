const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function worker(fetch) {
  const handlers = {};
  vm.runInNewContext(readFileSync(path.join(__dirname, '../../static/public/service-worker.js'), 'utf8'), {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    fetch, URL, Response,
  });
  return handlers;
}

test('offline retry stays with the installed admin or customer app', async () => {
  const handlers = worker(async () => { throw new Error('Offline'); });
  for (const [pathname, title, retry] of [
    ['/admin/', 'Mak Delivery Admin', '/admin/'],
    ['/admin?tab=orders', 'Mak Delivery Admin', '/admin/'],
    ['/', 'Mak Delivery', '/'],
    ['/restaurants', 'Mak Delivery', '/'],
    ['/administrator', 'Mak Delivery', '/'],
  ]) {
    let response;
    handlers.fetch({ request: { mode: 'navigate', url: 'https://example.test' + pathname }, respondWith: (value) => { response = value; } });
    const html = await (await response).text();
    assert.ok(html.includes(`<title>${title}</title>`));
    assert.ok(html.includes(`<a href="${retry}">Try again</a>`));
  }
});

test('online navigation is untouched and API responses never use offline HTML', async () => {
  const handlers = worker(async () => new Response('Live admin HTML'));
  let response;
  handlers.fetch({ request: { mode: 'navigate', url: 'https://example.test/admin/' }, respondWith: (value) => { response = value; } });
  assert.equal(await (await response).text(), 'Live admin HTML');
  let intercepted = false;
  handlers.fetch({ request: { mode: 'cors', url: 'https://example.test/api/orders' }, respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false);
});
