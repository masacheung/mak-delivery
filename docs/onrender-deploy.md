# Deploy on Render (static + server)

The app is a **monorepo**: Create React App output in `static/build`, Express entry in `server/index.js`. Render must install dependencies in **both** folders and start the Node server from the **repository root**.

## Recommended Render settings

| Setting | Value |
|--------|--------|
| **Environment** | **Node** 18+ (matches CRA / tooling; set in Render dashboard or `engines` in root `package.json`). |
| **Root directory** | *(empty)* — repository root, **not** `static` |
| **Build command** | `npm install && npm run render-build` |
| **Start command** | `npm start` |

- Root `package.json` is named **`mak-delivery-monorepo`** on purpose so `npm install` under `static/` does not hit npm’s “same package name” error when installing both trees.
- `npm install` at root reads the root `package.json` (no app dependencies at root; commit root `package-lock.json` if you use `npm ci` later).
- `npm run render-build` runs `install:all` (server + static) then `npm run build` in `static/`.
- `npm start` runs `node server/index.js`, which serves `static/build` and `/api`.

## Environment

Set the same variables you use locally (e.g. `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, Twilio keys). Optional: `PORT` (Render sets this automatically).

## If you must keep Root Directory = `static`

Render still clones the full repo, but commands run with `static` as the working directory.

| Setting | Value |
|--------|--------|
| **Root directory** | `static` |
| **Build command** | `npm install && npm run build && cd ../server && npm install` |
| **Start command** | `node ../server/index.js` |

Ensure `server/index.js` paths stay relative to the server folder (`../static/build`) — they already do.

Prefer **repository root** as Render root so the root `package.json` scripts stay simple and one place documents the flow.
