BEGIN;
CREATE TABLE IF NOT EXISTS sms_send_attempts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  phone_hash CHAR(64) NOT NULL,
  account_hash CHAR(64) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  provider_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (provider_status ~ '^[a-z_]{1,32}$'),
  provider_sid VARCHAR(34),
  provider_error_code VARCHAR(10)
);
CREATE INDEX IF NOT EXISTS sms_send_attempts_created ON sms_send_attempts(created_at);
COMMIT;
