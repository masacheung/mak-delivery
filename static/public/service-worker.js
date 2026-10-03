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
// Keep orders/auth/API responses off the offline cache.
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>Mak Delivery</title><h1>You are offline</h1><p>Connect to the internet to view menus and place orders.</p><a href="/">Try again</a>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
