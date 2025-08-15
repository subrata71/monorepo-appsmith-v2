-- Migration 004: Create graph tables
-- Description: Create tables for graphs, nodes, and edges for DAG editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create graphs table
CREATE TABLE graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adjacency_list TEXT NOT NULL DEFAULT '',
  is_valid BOOLEAN NOT NULL DEFAULT true,
  validation_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create graph_nodes table
CREATE TABLE graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID NOT NULL REFERENCES graphs(id) ON DELETE CASCADE,
  label VARCHAR(10) NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL
);

-- Create graph_edges table
CREATE TABLE graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID NOT NULL REFERENCES graphs(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  UNIQUE(source_id, target_id) -- Prevent duplicate edges
);

-- Create indexes for performance
CREATE INDEX idx_graph_nodes_graph_id ON graph_nodes(graph_id);
CREATE INDEX idx_graph_edges_graph_id ON graph_edges(graph_id);
CREATE INDEX idx_graph_edges_source_id ON graph_edges(source_id);
CREATE INDEX idx_graph_edges_target_id ON graph_edges(target_id);

-- Add trigger to update updated_at timestamp on graphs
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_graphs_updated_at 
  BEFORE UPDATE ON graphs 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();