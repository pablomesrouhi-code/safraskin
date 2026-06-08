-- Safra Skin — Admin dashboard + tracking migration (PostgreSQL)
-- Run once on production DB (Easypanel → database → SQL console)

-- ── Orders: geo + attribution ──
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_ip VARCHAR(45);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_vpn BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_hosting BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_valid_traffic BOOLEAN DEFAULT TRUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(200);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_valid_traffic ON orders(is_valid_traffic);

-- ── Tracking events ──
CREATE TABLE IF NOT EXISTS tracking_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(40) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    path VARCHAR(500),
    product_slug VARCHAR(50),
    client_ip VARCHAR(45),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    is_vpn BOOLEAN DEFAULT FALSE,
    is_proxy BOOLEAN DEFAULT FALSE,
    is_hosting BOOLEAN DEFAULT FALSE,
    is_valid_traffic BOOLEAN DEFAULT FALSE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(200),
    referrer VARCHAR(500),
    user_agent VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_events_valid ON tracking_events(is_valid_traffic);
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_product ON tracking_events(product_slug);
