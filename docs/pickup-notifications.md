# Pickup notifications (admin → customers)

Admins can notify customers who have an **order on a chosen date** at a **specific pickup location**. Customers see a **bell icon** with an **unread count**, a **dropdown list** of notices, an optional **popup** for new unread items, and can **mark read** / **mark all read**.

## Database

- Table: `delivery_notifications` (see `server/db/init.sql` and migration `server/db/migrations/002_delivery_notifications.sql`).
- **Existing deployments:** apply the migration once, for example:

  ```bash
  psql "$DATABASE_URL" -f server/db/migrations/002_delivery_notifications.sql
  ```

## API (`/api/notifications`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/admin/notify-pickup` | Admin JWT (`makAdminToken`) | Send one notification row per **distinct** `orders.username` where `pick_up_location` and calendar **date** match the request. |
| `GET` | `/admin/order-phones` | Admin JWT | Query: `pick_up_date`, `pick_up_location`. Returns distinct `users.phone_number` for users with a matching order (`orders` ⨝ `users`). JSON: `phones[]`, `phonesComma`, `phonesLines`, `count`. For **manual SMS** (copy/paste; no Twilio). |
| `GET` | `/unread-count` | User JWT | Unread count for badge (**only notifications created in the last 24 hours**, server time). |
| `GET` | `/` | User JWT | List notifications (**newest first** — `ORDER BY created_at DESC, id DESC`; **same 24-hour window**). The bell menu sorts the same way in the UI. |
| `PUT` | `/:id/read` | User JWT | Mark one as read (only if that row is within the last 24 hours). |
| `POST` | `/mark-all-read` | User JWT | Mark **recent** unread as read (same 24-hour window as the list). |

**`POST /admin/notify-pickup` body (JSON):**

| Field | Required | Notes |
|-------|----------|--------|
| `pickUpLocation` | Yes | Must match `orders.pick_up_location` exactly. |
| `pickUpDate` | Yes | `YYYY-MM-DD`. |
| `message` | No | Free text. |
| `etaMinutes` | No | Integer **0–1440**. Stored as human-readable `eta_summary` (e.g. `ETA: 25 minutes`; `0` → “Arriving now”). Omit or leave empty for no ETA line. |

`distance_km`, `admin_lat`, and `admin_lng` columns are left **NULL** (reserved for future use).

**Important:** `pickUpLocation` must match the customer pickup dropdown string exactly.

## Admin UI

- **Route:** `/admin` → tab **Customer notices** (`features/admin/AdminPickupNotify.js`).
- **Copy customer phones (for SMS app):** after choosing order date + pickup location, copies **comma-separated** numbers to the clipboard so you can paste into your phone’s SMS recipients. Only includes users present in **`users`** with a non-empty `phone_number` (same join as in-app notify).
- **Optional ETA:** number field — minutes until arrival; no geolocation or paid Maps APIs.
- **Optional message** — free text.

## Customer UI

- **Bell:** `static/src/components/PickupNotificationBell.js` on home (logged-in), restaurants, and edit-order headers.
- **Polling:** `usePickupNotifications` refetches about every **45s** while logged in.
- **Popup:** one dialog per notification `id` per browser session (`sessionStorage` key `makNotifPopup{id}`) when unread count increases.
- **Retention (customer view):** Rows older than **24 hours** (by `created_at`, server clock) are **not** returned in the list or unread count, so the bell only reflects same-day traffic. Older rows may remain in the database for auditing until you add a cleanup job.

## When the customer doesn’t keep the site open

In-app notices rely on the browser **loading the app** and the hook **polling** (`~45s` while logged in). If the user never opens the site that day, they **won’t see** the bell until their next visit (and only if the notice is still within the **24-hour** window). That’s normal for a **classic web app**—there is no background process on their phone/desktop unless you add one of the following.

| Approach | What it gives you | Effort / notes |
|----------|-------------------|----------------|
| **Do nothing extra** | Notices appear next time they open the site (same day). | Zero. Tell customers to check the app before pickup. |
| **Web Push (PWA + service worker)** | System notification even when the tab is closed (after they opt in). | Medium–high: HTTPS, VAPID keys, store `PushSubscription` per user, server sends push when admin notifies. |
| **SMS** (Twilio is already in the project) | Message reaches the phone without opening the site. | Medium: look up `users.phone_number` by `orders.username`, template text, cost per SMS, opt-in/consent. |
| **Manual SMS** | Admin copies numbers from **Customer notices** → **Copy customer phones** and sends from their own phone. | Free (carrier SMS rates only); see `GET /admin/order-phones`. |
| **Email** | Same idea if you add email to `users` and transactional mail. | Medium: new field, provider, templates. |

**Practical combo:** keep the current in-app bell for when they’re browsing, and add **SMS** (or Push later) if you need “they must see this without opening the site.”

## Related files

| Area | Files |
|------|--------|
| API | `server/api/notifications.js`, `server/index.js` |
| Admin form | `static/src/features/admin/AdminPickupNotify.js`, `static/src/features/admin/admin.js` |
| Customer hook | `static/src/hooks/usePickupNotifications.js` |
| Bell UI | `static/src/components/PickupNotificationBell.js` |
