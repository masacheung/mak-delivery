-- Run once against existing databases (psql, GUI, or your migration runner).
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'user';

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

COMMENT ON COLUMN users.role IS 'Access level: user (default) or admin (dashboard + admin APIs).';

-- Promote an account to admin (replace username):
-- UPDATE users SET role = 'admin' WHERE username = 'your_username';
