# Capacitor: wrap Mak Delivery as iOS / Android apps

This document is a **work plan and implementation guide** you can hand to a developer or an AI coding assistant. Goal: keep the **existing Render-hosted web app** working in the browser **and** ship a **mobile shell** (WebView) that loads the same experience (or a bundled build with the same API).

**Stack context today:** Create React App in `static/`, Express API + static files in `server/`, single deploy on [Render](https://render.com/) (one public HTTPS URL for UI + `/api`).

---

## What Capacitor does

[Capacitor](https://capacitorjs.com/) wraps your web app in a native **WebView** and optional **native plugins** (camera, push, filesystem, etc.). You keep React; native projects live in `ios/` and `android/` and are generated/maintained by the Capacitor CLI.

---

## Recommended approach: one production URL (simplest parity)

Point the mobile app’s WebView at your **live Render URL** (same as the browser).

| Access | How |
|--------|-----|
| Browser | User opens `https://your-service.onrender.com` |
| Mobile app | Capacitor loads `https://your-service.onrender.com` as `server.url` |

**Why this works well**

- One deploy on Render updates **web + in-app** web layer immediately (no app store resubmission for typical UI/API changes).
- Same origin: `localStorage`, JWT in `localStorage` / `sessionStorage`, cookies (if you add them), and `apiFetch` relative `/api` paths behave like the browser **as long as the WebView loads that exact origin**.
- Matches your current architecture (Express serves `static/build` + `/api`).

**Trade-offs**

- App store review still applies to the **native shell** (icon, splash, permissions, privacy text). Changing only the website does not require a new binary unless you change native config or plugins.
- Offline: without extra work, the app needs network (like the site). You can add offline caching later (service worker / Capacitor preferences).

**Alternative: ship static files inside the IPA/APK**

- Set `webDir` to `static/build` and **do not** set `server.url` for production, or use a hybrid.
- Then you must set `REACT_APP_API_BASE=https://your-service.onrender.com` at **build time** so `/api` calls hit Render while assets are local.
- Every meaningful front-end release implies rebuilding the app and often resubmitting to stores. More moving parts; use only if you need offline-first assets or stricter isolation.

This plan assumes **remote `server.url` → Render** unless you explicitly choose the bundled static approach later.

---

## Prerequisites (human / CI)

- **Node.js** (LTS, e.g. 18+), same repo as today.
- **Apple:** macOS, Xcode, Apple Developer account (for device + App Store).
- **Google:** Android Studio, Play Console account.
- **Render:** stable HTTPS URL (custom domain optional); note whether you use Render’s free tier (cold starts affect first open in the app).

---

## Work plan (phases)

### Phase 0 — Decisions (short)

1. Confirm production URL: `https://<your-service>.onrender.com` (or custom domain).
2. Choose **remote URL** vs **bundled static** (recommend remote for first version).
3. List **native features** you might want later (push, deep links, biometric storage for tokens). Phase 1 can ship with **zero** extra plugins.

### Phase 1 — Add Capacitor to the repo (no store yet)

**Goal:** `npx cap sync` produces `ios/` and `android/`; debug build opens your Render site in the WebView.

1. In `static/` (CRA root), install:

   ```bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/ios @capacitor/android
   ```

2. Initialize (example app id — change to your reverse-DNS):

   ```bash
   npx cap init "Mak Delivery" com.example.makdelivery --web-dir build
   ```

3. Add `capacitor.config.json` (or `.ts`) with at least:

    - `appId`, `appName`, `webDir: "build"`.
    - **`server.url`**: `https://your-service.onrender.com` for **development/testing** of the remote pattern (see Capacitor docs for `server` block).
    - **`server.cleartext`**: `false` (HTTPS only on Render).

4. **Allow navigation** to your host if Capacitor version requires `allowNavigation` / `hostname` settings (see current Capacitor docs for your major version).

5. Build CRA once so `static/build` exists:

   ```bash
   npm run build
   ```

6. Add platforms and sync:

   ```bash
   npx cap add ios
   npx cap add android
   npx cap sync
   ```

7. Open native projects:

   ```bash
   npx cap open ios
   npx cap open android
   ```

8. Run on simulator/emulator; verify login, `/api` calls, and admin vs customer flows.

**AI / implementer checklist**

- [ ] Capacitor config committed; `webDir` points to CRA `build`.
- [ ] Production Render URL correct in `server.url` for the build you test.
- [ ] No mixed content (Render is HTTPS — good).
- [ ] If geolocation is used, iOS `Info.plist` and Android manifest need location usage strings (Capacitor Geolocation plugin or WKWebView permissions).

### Phase 2 — Environment-specific config (dev vs prod)

**Goal:** Local dev still works without breaking mobile.

- **Browser dev:** unchanged — `npm run startServer` + optional CRA dev (your current workflow).
- **Capacitor dev:** either load **staging** Render URL or temporary `server.url` to `http://10.0.2.2:3000` (Android emulator) / machine IP for LAN — only if you need local API; otherwise point `server.url` at a Render **preview** deploy.

Document in `README` or `.env.example`:

- `CAP_SERVER_URL` not always used by Capacitor natively — often you maintain two config files or swap `capacitor.config` per build; follow Capacitor’s recommended pattern for multiple environments.

### Phase 3 — Store readiness

**Goal:** Meet Apple / Google requirements.

1. **Icons & splash** — use `@capacitor/assets` or manual assets; match brand.
2. **Privacy** — disclose what you collect (accounts, phone, orders, analytics). Link to privacy policy URL (can be a page on the same Render app).
3. **iOS** — App Transport Security (HTTPS Render OK), signing, provisioning, TestFlight.
4. **Android** — signing key, target SDK, Play data safety form.
5. **Deep links (optional)** — `makdelivery://` or Universal Links to open a specific route (e.g. order lookup). Requires native config + small React Router awareness.

### Phase 4 — Optional enhancements

| Feature | Notes |
|---------|--------|
| **Push notifications** | Firebase (FCM) + Capacitor Push plugin + server to send pushes; more work than SMS; complements in-app bell. |
| **Secure token storage** | Prefer encrypted storage plugin if you move off `localStorage` for long-lived secrets. |
| **Background refresh** | Limited on mobile OSes; polling in foreground only unless you add push. |
| **PWA** | Alternative/complement: installable web app without stores; different trade-offs. |

---

## Render.com specifics

1. **Single service** serving both static UI and `/api` (your current pattern) is ideal for Capacitor remote URL — one hostname.
2. **Cold starts:** free tier may spin down; first open in the app may be slow. Consider paid instance or keep-alive if UX matters.
3. **`REACT_APP_API_BASE`:** leave unset in production if the WebView origin is Render (same-origin `/api`). Set it only if the WebView origin differs (bundled static case).
4. **Custom domain:** update `server.url` and any `allowNavigation` entries to match.

Render docs: [https://render.com/docs](https://render.com/docs)

---

## Instructions you can paste to an AI assistant

Use a prompt like:

> Implement Capacitor in this repo under `static/` for a Create React App. Use `webDir: build`. For production, configure the iOS and Android apps to load `https://<OUR_RENDER_URL>` via Capacitor `server.url` so the mobile WebView matches browser behavior (same origin for `/api` and `localStorage`). Add npm scripts: `cap:sync` runs `npm run build && npx cap sync`. Document any iOS/Android permission strings needed for existing features (e.g. geolocation). Do not remove or break the existing Render deployment; browser users unchanged.

Adjust the URL and app id to your real values.

---

## Risk / test matrix (before store release)

- [ ] Login (user + admin), JWT persistence after app backgrounded.
- [ ] Order submit, order lookup, pickup notifications bell + polling.
- [ ] File download / export if any (mobile WebView quirks).
- [ ] Leaflet maps (touch, sizing).
- [ ] Clipboard (admin copy phones) on iOS Safari WebView rules.
- [ ] Session storage for admin token vs localStorage for user — both should persist per platform defaults.

---

## Summary

| Question | Answer |
|----------|--------|
| Web + mobile both usable? | Yes: browser → Render URL; app → same Render URL in WebView (recommended). |
| One deploy? | Yes for the web layer when using remote `server.url`. |
| Where to implement? | Primarily `static/` + generated `ios/` / `android/`; keep `server/` as today. |
| First doc to read externally? | [Capacitor — Getting Started](https://capacitorjs.com/docs/getting-started) and [Config](https://capacitorjs.com/docs/config). |

This file is planning only; it does not add Capacitor to the repository until you run Phase 1 or delegate it to an implementer.
