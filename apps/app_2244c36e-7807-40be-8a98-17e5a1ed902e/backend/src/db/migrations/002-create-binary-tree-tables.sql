-- Create binary tree tables for the Tree Visualizer application
-- Migration: 002-create-binary-tree-tables.sql

-- Tree Nodes table - individual nodes in the binary tree
CREATE TABLE tree_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value INTEGER NOT NULL,
  left_id UUID REFERENCES tree_nodes(id) ON DELETE SET NULL,
  right_id UUID REFERENCES tree_nodes(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES tree_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Trees table - container for the binary tree structure
CREATE TABLE trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_id UUID REFERENCES tree_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Traversal Steps table - for storing traversal sequences
CREATE TABLE traversal_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES tree_nodes(id) ON DELETE CASCADE NOT NULL,
  "order" INTEGER NOT NULL,
  traversal_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_tree_nodes_value ON tree_nodes(value);
CREATE INDEX idx_tree_nodes_parent ON tree_nodes(parent_id);
CREATE INDEX idx_tree_nodes_left ON tree_nodes(left_id);
CREATE INDEX idx_tree_nodes_right ON tree_nodes(right_id);
CREATE INDEX idx_trees_root ON trees(root_id);
CREATE INDEX idx_traversal_steps_node ON traversal_steps(node_id);
CREATE INDEX idx_traversal_steps_type ON traversal_steps(traversal_type);

-- Add unique constraint to prevent duplicate values in tree nodes
CREATE UNIQUE INDEX idx_tree_nodes_unique_value ON tree_nodes(value);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tree_nodes_updated_at BEFORE UPDATE ON tree_nodes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trees_updated_at BEFORE UPDATE ON trees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traversal_steps_updated_at BEFORE UPDATE ON traversal_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();