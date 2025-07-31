-- Create BST tables for storing tree structures
CREATE TABLE bst_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  root_node_id UUID REFERENCES bst_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE bst_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value INTEGER NOT NULL,
  left_node_id UUID REFERENCES bst_nodes(id) ON DELETE SET NULL,
  right_node_id UUID REFERENCES bst_nodes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add foreign key constraint after both tables exist
ALTER TABLE bst_trees ADD CONSTRAINT bst_trees_root_node_fkey 
  FOREIGN KEY (root_node_id) REFERENCES bst_nodes(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_bst_nodes_value ON bst_nodes(value);
CREATE INDEX idx_bst_nodes_left ON bst_nodes(left_node_id);
CREATE INDEX idx_bst_nodes_right ON bst_nodes(right_node_id);
CREATE INDEX idx_bst_trees_root ON bst_trees(root_node_id);