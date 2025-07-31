-- Create tree_snapshots table for undo/redo functionality
CREATE TABLE IF NOT EXISTS tree_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  operation VARCHAR(50) NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index for efficient querying by tree_id and order
CREATE INDEX idx_tree_snapshots_tree_order ON tree_snapshots(tree_id, "order");