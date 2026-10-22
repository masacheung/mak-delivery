# Local Docker copy of Mak Delivery

The Render service remains live. This setup is independent and does not change DNS,
Render settings, or the source database. Local URL: http://localhost:3010.
Postgres is bound to localhost:54331; both ports are separate from Cheung Property.

## mak-delivery.cheung-hub.com

The website also joins the existing `cheung-hub-ingress` Docker network, with the
unique alias `delivery-app`. Only the app joins that network; its database stays
on the Mak Delivery private network. `up` creates the ingress network if absent.
The existing Property cloudflared connector serves the shared network; do not
start another connector or copy its token into this repository.

The Compose service is named `delivery-app` as well. Keep service names unique
on the shared ingress network: Docker automatically publishes the service name
as a DNS alias, even when extra aliases are configured. A generic `app` service
would conflict with Property's existing `app:3001` Tunnel route.

In the existing Cloudflare Tunnel, add a Published application route:

| Setting | Value |
| --- | --- |
| Subdomain | `mak-delivery` |
| Domain | `cheung-hub.com` |
| Path | Empty |
| Service type | HTTP |
| Service URL | `delivery-app:3000` |

For a single URL field use `http://delivery-app:3000`. The public URL is
`https://mak-delivery.cheung-hub.com`; localhost:3010 continues working. Use the
container port 3000 for the Tunnel, not the host port 3010. Do not publish a
database Tunnel route. The shared connector and this PC must stay running.
The installation guide uses the current website origin so it supports both
Render and the new hostname. Mak Delivery retains its own customer accounts;
this routing does not integrate it with Property/Tools central authentication.

Render remains independent and live. Orders placed at the new hostname are stored
only in the local database, and Render orders stay on Render. Until a final
cutover, treat the new hostname as a test copy and avoid directing customers there.
SMS and the notification worker remain disabled as in the local preview.

## Commands (run from repository root)

```powershell
node scripts/local-docker.cjs setup
node scripts/local-docker.cjs backup
node scripts/local-docker.cjs restore render-<timestamp>.dump
node scripts/local-docker.cjs up
node scripts/local-docker.cjs status
node scripts/local-docker.cjs stop
```

Docker Desktop must be running. Setup generates `.env.docker` with independent local
database and JWT secrets. The helper currently uses the installed server dependencies;
on a fresh checkout run `npm ci --prefix server` first.

Backup reads the Render DB credentials from the existing root `.env`, uses PostgreSQL
18 `pg_dump` custom format, checks the archive catalog, and writes a SHA-256 metadata
file next to the archive in `backups/`. The live database stays online. Failed dumps
have no metadata file and must not be treated as completed backups.

Restore checks the SHA-256 and refuses a nonempty local public schema. It runs in one
transaction with errors fatal, restores tables/data/sequences/indexes/constraints,
and omits Render-specific ownership and grants. This is an application database
backup, not a copy of Render roles, passwords, or service configuration.

Backups and `.env.docker` are gitignored and excluded from Docker builds. Archives
contain customer data; keep them private. Copy a completed archive and its JSON
metadata to your usual separate backup storage if you want protection against loss
of this computer. The database volume persists when containers are stopped. Avoid
`docker compose down -v`, which removes the local database volume.

The local application uses the current checkout, including uncommitted changes.
SMS is disabled, production Twilio/VAPID credentials are absent, and no notification
worker is started. Existing verified accounts retain their passwords. Existing login
tokens must be replaced by logging in again because the local JWT secret is different.
Phone verification/new signup requiring SMS is unavailable in this local preview.

The snapshot does not sync with Render. Before a later production cutover, take a
fresh backup and plan the final write freeze, restore, public HTTPS/domain routing,
SMS, and notification worker configuration. Do not reuse pending push deliveries
without reviewing them.


## Node.js runtime

Docker uses Node.js 22.23.4 (security release, 2026-10-21). The root .nvmrc records the same version for local development. Build with docker compose --env-file .env.docker build --pull delivery-app, then restart delivery-app and verify /healthz.
