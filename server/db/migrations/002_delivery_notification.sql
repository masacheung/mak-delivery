-- Pickup notifications: admin broadcasts to users with an order on a given date at a pickup location.
CREATE TABLE IF NOT EXISTS delivery_notifications (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    pick_up_location TEXT NOT NULL,
    pick_up_date DATE NOT NULL,
    message TEXT,
    eta_summary TEXT,
    distance_km DECIMAL(10, 2),
    admin_lat DECIMAL(10, 7),
    admin_lng DECIMAL(10, 7),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_notifications_username_created
    ON delivery_notifications (username, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_delivery_notifications_username_unread
    ON delivery_notifications (username) WHERE read_at IS NULL;
