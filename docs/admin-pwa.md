# Install Mak Delivery Admin

The customer app and admin app have separate PWA identities:

| App | Install / launch URL | Manifest |
| --- | --- | --- |
| Mak Delivery | `/` | `/manifest.json` |
| Mak Delivery Admin | `/admin/` | `/admin/manifest.json` |

Open `https://mak-delivery.onrender.com/admin/` in your phone browser after deployment. On iPhone, use Safari → Share → Add to Home Screen; on Android, use Chrome's Install app / Add to Home Screen menu. Confirm the app is named **Mak Delivery Admin** and shows the blue shield icon. Opening its icon goes to the admin login/dashboard. Authentication and admin permissions still apply.

An existing customer app icon will continue opening `/`; it does not automatically become the admin app. Keep it if needed and install Admin as the additional app. If an older home-screen shortcut was intended for Admin but shows the customer app, remove only that old shortcut and add Admin again from `/admin/`.

The server redirects `/admin` to `/admin/`, preserving its query, and serves the admin manifest, Apple title, and icons in the initial HTML. Client-side navigation also updates the document metadata. Admin manifest `id`, `start_url`, and `scope` are all `/admin/`. Root customer manifest remains unchanged.

Both identities use the existing root service worker so existing delivery push subscriptions do not need to migrate. There is no API, account, order, or admin-page offline cache. Offline retry returns Admin to `/admin/` and customers to `/`.

Validation:

```powershell
node --test server/api/*.test.js server/services/*.test.js server/utils/*.test.js
$env:CI = 'true'
npm --prefix static test -- --watchAll=false --runInBand
npm run build
```

After deploying, check `/admin/` links `/admin/manifest.json` and `/` still links `/manifest.json`, then verify installing and launching on real iPhone/Android devices. Installing an app is a browser/phone operation; desktop checks validate the delivered identity and launch URL, not the mobile OS installation itself.
