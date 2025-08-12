-- Create __entityPlural__ table
CREATE TABLE IF NOT EXISTS __entityPlural__ (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);