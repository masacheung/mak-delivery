import { ADMIN_PWA, CUSTOMER_PWA, applyPwaMetadata, pwaForPath } from './pwa';
import adminManifest from '../public/admin/manifest.json';
import customerManifest from '../public/manifest.json';

beforeEach(() => {
  document.head.innerHTML = '<title>Mak Delivery</title><link rel="manifest" href="/manifest.json"><link rel="icon" href="/delivery-truck.png"><link rel="apple-touch-icon" href="/delivery-truck.png"><meta name="apple-mobile-web-app-title" content="Mak Delivery"><meta name="theme-color" content="#5557d9">';
});

test.each(['/admin', '/admin/', '/admin/orders'])('selects admin metadata for %s', pathname => {
  expect(pwaForPath(pathname)).toBe(ADMIN_PWA);
});

test.each(['/', '/auth', '/install-guide', '/administrator', '/administer', '/restaurants'])('keeps customer metadata for %s', pathname => {
  expect(pwaForPath(pathname)).toBe(CUSTOMER_PWA);
});

test('a direct admin entry uses its own manifest, title, and iPhone icon', () => {
  applyPwaMetadata('/admin/');
  expect(document.title).toBe('Mak Delivery Admin');
  expect(document.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/admin/manifest.json');
  expect(document.querySelector('link[rel="apple-touch-icon"]').getAttribute('href')).toBe('/admin/icon-180.png');
  expect(document.querySelector('link[rel="icon"]').getAttribute('href')).toBe('/admin/icon-192.png');
  expect(document.querySelector('meta[name="apple-mobile-web-app-title"]').content).toBe('Mak Delivery Admin');
  expect(document.querySelector('meta[name="apple-mobile-web-app-capable"]').content).toBe('yes');
  expect(document.querySelector('meta[name="theme-color"]').content).toBe('#173b6b');
});

test('route transitions restore customer metadata without duplicating head tags', () => {
  applyPwaMetadata('/admin/');
  applyPwaMetadata('/');
  applyPwaMetadata('/install-guide');
  expect(document.title).toBe('Mak Delivery');
  expect(document.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/manifest.json');
  expect(document.querySelector('link[rel="apple-touch-icon"]').getAttribute('href')).toBe('/delivery-truck.png');
  expect(document.querySelector('meta[name="apple-mobile-web-app-title"]').content).toBe('Mak Delivery');
  expect(document.querySelectorAll('link[rel="manifest"]')).toHaveLength(1);
  expect(document.querySelectorAll('meta[name="apple-mobile-web-app-capable"]')).toHaveLength(1);
});

test('creates metadata when tags are missing', () => {
  document.head.innerHTML = '';
  applyPwaMetadata('/admin/');
  expect(document.title).toBe('Mak Delivery Admin');
  expect(document.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/admin/manifest.json');
});

test('admin installs have a distinct identity and launch inside their own canonical scope', () => {
  expect(adminManifest.id).toBe('/admin/');
  expect(adminManifest.id).not.toBe(customerManifest.id);
  expect(adminManifest.start_url).toBe('/admin/');
  expect(adminManifest.scope).toBe('/admin/');
  expect(adminManifest.name).toBe('Mak Delivery Admin');
  expect(adminManifest.short_name).toBe('Mak Delivery Admin');
  expect(adminManifest.display).toBe('standalone');
  expect(adminManifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/admin/icon-192.png', sizes: '192x192', type: 'image/png' }),
    expect.objectContaining({ src: '/admin/icon-512.png', sizes: '512x512', type: 'image/png' }),
  ]));
  adminManifest.icons.forEach(icon => expect(icon.src.startsWith('/admin/')).toBe(true));
  expect(customerManifest.start_url).toBe('/');
  expect(customerManifest.scope).toBe('/');
});
