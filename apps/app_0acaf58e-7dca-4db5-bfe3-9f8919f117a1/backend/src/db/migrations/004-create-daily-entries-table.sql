-- Create daily entries table for one-sentence journal entries
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  sentence VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create unique index to ensure one entry per user per date
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_date ON daily_entries (user_id, entry_date);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON daily_entries (user_id);

-- Create index on entry_date for date-based queries
CREATE INDEX IF NOT EXISTS idx_daily_entries_entry_date ON daily_entries (entry_date);