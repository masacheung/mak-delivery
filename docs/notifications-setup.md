# PWA, arrival reminders and event announcements

All code is local until deployed. Do not start the worker against the live database for testing: due jobs will notify real customers.

## Database

Apply `server/db/migrations/003_push_arrivals_sessions.sql` once through your normal database migration workflow. It is additive and includes the existing delivery-notification table if absent. It adds preferences, device subscriptions, durable jobs/outbox, worker heartbeat and hashed login sessions. It does not create orders, events or send notifications.

An explicit migration command is available: `npm run migrate:notifications`. Check which database your environment points to before running it. It is never run automatically on app startup/build.

## Render configuration

Keep `DB_USER`, `DB_HOST`, `DB_DATABASE`, `DB_PASSWORD`, `DB_PORT` and production `JWT_SECRET` in Render environment settings. Local values stay in the Git-ignored root `.env`.

Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` on the web service and worker. A local VAPID identity has been generated in `.env`; use the same stable identity when deploying. Never commit the private key. Subject is the public site URL. Rotating VAPID keys requires device re-subscription.

Run a separate **always-on background worker**, with the same repository and environment:

```text
Build: npm run install:all
Start: npm run notifications:worker
```

The web app starts with `npm start`. Do not rely on a sleeping free web service or an admin browser tab for timed notifications. Admin → Arrival times shows a plain-language availability notice when automatic reminders are unavailable. An offline worker leaves jobs queued. Polling every 20 seconds means a reminder may be sent shortly after its scheduled minute. Device/network delivery is not guaranteed to be exact.

## Customer workflow

Login has a “Keep me signed in for 30 days” option. Short-lived access tokens remain 24h; an HttpOnly, SameSite=Strict secure production cookie restores the session until its fixed 30-day expiry. Session secrets are stored hashed. Signing out revokes the cookie session, unsubscribes this device and prevents offline auto-login. Password changes invalidate remembered sessions. Existing users need to sign in again to enable remember-login.

Phone notifications are available from the home page and notification bell. iPhone users add the app to the home screen, open that app, sign in and tap Enable phone notifications. Permission is requested only on that tap. Users separately choose pickup reminders and new-event announcements. No orders/auth/API data are cached for offline use.

## Admin workflow

Arrival times replaces the former Customer notices tab. After collecting the food and preparing to depart, the admin selects date → an actual location from that day’s event → arrival time (America/New_York) → lead time (default 15 min) → save. Save another location to build the day’s route. Pending reminders can be edited/cancelled. Already dispatched reminders cannot be silently re-sent. Reminders target distinct users whose orders match both date and exact pickup address and who have pickup notices enabled.

New events: select “Notify users subscribed to new delivery events” before opening the event. Event creation and notification queueing share a transaction. Subscribers receive an in-app notice and opted-in devices receive Push. Announcements are opt-in per event and per user preference. Existing manual notices also use the queue.

Worker transactions use row locks and notification uniqueness to prevent duplicate database notices. Push has a stable notification tag and bounded retries; expired device endpoints are removed. Arrival notices overdue by more than 30 minutes are cancelled rather than announcing stale arrival information. Failed pushes remain recorded in `notification_push_outbox` for diagnosis.

## Validation without contacting users

Automated tests use isolated database mocks. UI screenshots use an isolated fixture server; saving only updates in-memory fixtures and no worker runs. Actual iOS/Android lock-screen delivery must be tested after deployment on a dedicated test account/device with permission enabled.
