-- Create games table for 2048 game state
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grid JSONB NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'playing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index on status for filtering active games
CREATE INDEX IF NOT EXISTS idx_games_status ON games (status);

-- Add index on score for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_games_score ON games (score DESC);