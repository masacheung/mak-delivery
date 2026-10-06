export const CUSTOMER_PWA = Object.freeze({
  name: 'Mak Delivery',
  manifest: '/manifest.json',
  icon: '/delivery-truck.png',
  appleIcon: '/delivery-truck.png',
  themeColor: '#5557d9',
});

export const ADMIN_PWA = Object.freeze({
  name: 'Mak Delivery Admin',
  manifest: '/admin/manifest.json',
  icon: '/admin/icon-192.png',
  appleIcon: '/admin/icon-180.png',
  themeColor: '#173b6b',
});

export function pwaForPath(pathname) {
  return /^\/admin(?:\/|$)/.test(pathname) ? ADMIN_PWA : CUSTOMER_PWA;
}

function setHeadAttribute(doc, selector, tagName, attributes) {
  let element = doc.head.querySelector(selector);
  if (!element) {
    element = doc.createElement(tagName);
    doc.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
}

// Use one root service worker so existing phone notifications keep their subscription.
export function applyPwaMetadata(pathname, doc = document) {
  const settings = pwaForPath(pathname);
  doc.title = settings.name;
  setHeadAttribute(doc, 'link[rel="manifest"]', 'link', { rel: 'manifest', href: settings.manifest });
  setHeadAttribute(doc, 'link[rel="icon"]', 'link', { rel: 'icon', href: settings.icon });
  setHeadAttribute(doc, 'link[rel="apple-touch-icon"]', 'link', { rel: 'apple-touch-icon', href: settings.appleIcon });
  setHeadAttribute(doc, 'meta[name="apple-mobile-web-app-title"]', 'meta', {
    name: 'apple-mobile-web-app-title', content: settings.name,
  });
  setHeadAttribute(doc, 'meta[name="apple-mobile-web-app-capable"]', 'meta', {
    name: 'apple-mobile-web-app-capable', content: 'yes',
  });
  setHeadAttribute(doc, 'meta[name="theme-color"]', 'meta', { name: 'theme-color', content: settings.themeColor });
  return settings;
}
