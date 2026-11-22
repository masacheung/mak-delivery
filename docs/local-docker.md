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
SMS was enabled on October 26, 2026 (New York time), as described below. The
notification worker remains disabled.

## Commands (run from repository root)

```powershell
node scripts/local-docker.cjs setup
node scripts/local-docker.cjs backup
node scripts/local-docker.cjs restore render-<timestamp>.dump
node scripts/local-docker.cjs up
node scripts/local-docker.cjs status
node scripts/local-docker.cjs stop
```

### Refresh an existing local database from Render

```powershell
node scripts/local-docker.cjs backup
node scripts/refresh-local-db.cjs render-<timestamp>.dump
```

The refresh command explicitly replaces the local database contents. It verifies
the archive checksum and restores into a new staging database before stopping the
local website. Then it dumps the existing local database to `backups/`, records
all public-table row counts, and atomically swaps the database names. The previous
local database remains as `mak_delivery_previous_<timestamp>` with connections
disabled; the archive and its checksum provide an additional rollback copy.
The app is restarted using its existing image and settings. No Render settings
are changed and no SMS or push messages are sent. Avoid editing in DBeaver during
this operation; open database connections are terminated when the names swap.

The successful refresh report is saved as `backups/refresh-<timestamp>.json`.
On October 25, 2026 (New York time), the refresh restored 10 public tables:
684 users, 1,461 orders, and 95 admin configuration rows. Local and public
homepage/health checks returned HTTP 200 afterward. SMS remains disabled.

### Apply local schema updates

```powershell
node scripts/migrate-local-db.cjs
```

This command backs up the current local database, then applies the reviewed,
repeatable SQL migrations in `server/db/migrations` to the Docker `db` service
using transactions and bounded lock waits. It does not read root `.env` or connect
to Render. Run it after importing a Render backup when local code needs newer
tables. The root `npm run migrate:*` scripts load `.env` and therefore must not
be used on the host for local Docker migrations while `.env` points at Render.
Applying schema updates does not enable SMS, start a worker, or send messages.

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
No notification worker is started, and VAPID credentials remain absent.
Existing verified accounts retain their passwords. Existing login
tokens must be replaced by logging in again because the local JWT secret is different.
Phone verification and new signup use real Twilio Verify SMS after enabling the
configuration below.

## Local SMS verification

The ignored `.env.docker` contains `LOCAL_SMS_ENABLED=true` and the selected
`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_VERIFY_SERVICE_SID` values
copied from the existing root `.env`. Compose passes only these SMS settings into
the app alongside its independent local database and JWT settings. Root `.env`
is not loaded into the container. Credentials are excluded from Git and image builds.

`SMS_DAILY_LIMIT` defaults to 200 send attempts per rolling 24 hours. The existing
phone/account/IP limits also apply; see [SMS safety](sms-safety.md). Local and Render
use separate database counters even when sharing the same Twilio account. Real
signup/resend requests incur normal Twilio charges.

After changing `.env.docker`, apply it with:

```powershell
docker compose --env-file .env.docker up -d --no-deps --wait delivery-app
```

To disable local verification, set `LOCAL_SMS_ENABLED=false` and run the same command.
SMS defaults to disabled on a fresh setup without this explicit flag.

The snapshot does not sync with Render. Before a later production cutover, take a
fresh backup and plan the final write freeze, restore, public HTTPS/domain routing,
SMS verification, and notification worker configuration. Do not reuse pending push deliveries
without reviewing them.


## Node.js runtime

Docker uses Node.js 22.23.4 (security release, 2026-10-21). The root .nvmrc records the same version for local development. Build with docker compose --env-file .env.docker build --pull delivery-app, then restart delivery-app and verify /healthz.
