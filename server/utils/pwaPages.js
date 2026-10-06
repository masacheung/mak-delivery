const { readFile } = require('node:fs/promises');
const path = require('node:path');

function adminPageHtml(html) {
  let result = html
    .replace(/<title>[^<]*<\/title>/i, '<title>Mak Delivery Admin</title>')
    .replace(/<link\b[^>]*\brel=["']manifest["'][^>]*>/i, '<link rel="manifest" href="/admin/manifest.json"/>')
    .replace(/<meta\b[^>]*\bname=["']apple-mobile-web-app-title["'][^>]*>/i, '<meta name="apple-mobile-web-app-title" content="Mak Delivery Admin"/>')
    .replace(/<link\b[^>]*\brel=["']apple-touch-icon["'][^>]*>/i, '<link rel="apple-touch-icon" href="/admin/icon-180.png"/>')
    .replace(/<link\b[^>]*\brel=["']icon["'][^>]*>/i, '<link rel="icon" href="/admin/icon-192.png"/>')
    .replace(/<meta\b[^>]*\bname=["']theme-color["'][^>]*>/i, '<meta name="theme-color" content="#173b6b"/>');
  if (!/name=["']apple-mobile-web-app-capable["']/i.test(result)) {
    result = result.replace(/<\/head>/i, '<meta name="apple-mobile-web-app-capable" content="yes"/></head>');
  }
  return result;
}

function registerAdminPwaPage(app, clientBuild) {
  // Before express.static: /admin contains manifest/icons and its directory
  // redirect must not replace our canonical redirect or HTML response.
  app.get(/^\/admin\/?$/, async (req, res, next) => {
    if (req.path === '/admin') {
      const query = req.originalUrl.slice('/admin'.length);
      return res.redirect(308, '/admin/' + query);
    }
    try {
      const html = await readFile(path.join(clientBuild, 'index.html'), 'utf8');
      res.set('Cache-Control', 'no-store').type('html').send(adminPageHtml(html));
    } catch (error) {
      next(error);
    }
  });
}

module.exports = { adminPageHtml, registerAdminPwaPage };
