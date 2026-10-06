self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let notice = {};
  try { notice = event.data?.json() || {}; } catch { notice = { body: event.data?.text() }; }
  event.waitUntil(self.registration.showNotification(notice.title || 'Mak Delivery', {
    body: notice.body || 'You have a new delivery update.', icon: '/delivery-truck.png',
    tag: notice.tag || 'mak-delivery', data: { url: notice.url === '/restaurants' ? '/restaurants' : '/' },
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(new URL(event.notification.data?.url || '/', self.location.origin).href));
});
// Keep orders/auth/API responses off the offline cache. The shared worker keeps
// existing push subscriptions while each installed app has its own manifest.
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  const admin = /^\/admin(?:\/|$)/.test(new URL(event.request.url).pathname);
  const title = admin ? 'Mak Delivery Admin' : 'Mak Delivery';
  const retry = admin ? '/admin/' : '/';
  const message = admin
    ? 'Connect to the internet to sign in and manage deliveries.'
    : 'Connect to the internet to view menus and place orders.';
  event.respondWith(fetch(event.request).catch(() => new Response(
    `<!doctype html><meta name="viewport" content="width=device-width"><title>${title}</title><h1>You are offline</h1><p>${message}</p><a href="${retry}">Try again</a>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )));
});
