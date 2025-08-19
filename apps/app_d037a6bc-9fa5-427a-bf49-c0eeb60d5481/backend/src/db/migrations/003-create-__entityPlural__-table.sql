-- Create __entityPlural__ table
CREATE TABLE IF NOT EXISTS __entityPlural__ (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
