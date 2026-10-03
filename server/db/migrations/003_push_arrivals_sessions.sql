BEGIN;
CREATE TABLE IF NOT EXISTS delivery_notifications (
  id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL,
  pick_up_location TEXT NOT NULL, pick_up_date DATE NOT NULL,
  message TEXT, eta_summary TEXT, distance_km DECIMAL(10,2),
  admin_lat DECIMAL(10,7), admin_lng DECIMAL(10,7), read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE delivery_notifications ADD COLUMN IF NOT EXISTS job_id BIGINT;
ALTER TABLE delivery_notifications ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'pickup';
CREATE UNIQUE INDEX IF NOT EXISTS notification_job_user ON delivery_notifications(job_id, username);
CREATE INDEX IF NOT EXISTS notification_user_created ON delivery_notifications(username, created_at DESC);
CREATE TABLE IF NOT EXISTS notification_preferences (
  username TEXT PRIMARY KEY, pickup BOOLEAN NOT NULL DEFAULT TRUE, events BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY, username TEXT NOT NULL, subscription JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS push_subscription_user ON push_subscriptions(username);
CREATE TABLE IF NOT EXISTS notification_jobs (
  id BIGSERIAL PRIMARY KEY, dedupe_key TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('pickup','event')),
  pick_up_date DATE NOT NULL, pick_up_location TEXT NOT NULL,
  arrival_at TIMESTAMPTZ, lead_minutes INTEGER,
  send_at TIMESTAMPTZ NOT NULL, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','cancelled')),
  created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS notification_job_due ON notification_jobs(send_at) WHERE status = 'pending';
CREATE TABLE IF NOT EXISTS notification_push_outbox (
  notification_id INTEGER NOT NULL REFERENCES delivery_notifications(id),
  endpoint TEXT NOT NULL REFERENCES push_subscriptions(endpoint) ON DELETE CASCADE,
  payload JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_error TEXT,
  PRIMARY KEY(notification_id, endpoint)
);
CREATE TABLE IF NOT EXISTS notification_worker_state (id INTEGER PRIMARY KEY CHECK(id=1), last_seen_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS login_sessions (
  token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, password_version TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS login_session_expiry ON login_sessions(expires_at);
COMMIT;
