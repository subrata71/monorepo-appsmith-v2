import { pgTable, uuid, varchar, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// Tree Nodes table - individual nodes in the binary tree
export const treeNodes = pgTable('tree_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: integer('value').notNull(),
  leftId: uuid('left_id'),
  rightId: uuid('right_id'),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trees table - container for the binary tree structure
export const trees = pgTable('trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  rootId: uuid('root_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Traversal Steps table - for storing traversal sequences
export const traversalSteps = pgTable('traversal_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  nodeId: uuid('node_id').notNull(),
  order: integer('order').notNull(),
  traversalType: varchar('traversal_type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tree Snapshots table - for storing tree states for undo/redo functionality
export const treeSnapshots = pgTable('tree_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull(),
  snapshot: jsonb('snapshot').notNull(), // JSON representation of tree structure
  operation: varchar('operation', { length: 50 }).notNull(), // 'add', 'remove', 'clear'
  order: integer('order').notNull(), // Order in the undo/redo stack
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/** Tree node types */
export type TreeNode = typeof treeNodes.$inferSelect;
export type NewTreeNode = typeof treeNodes.$inferInsert;

/** Tree types */
export type Tree = typeof trees.$inferSelect;
export type NewTree = typeof trees.$inferInsert;

/** Traversal step types */
export type TraversalStep = typeof traversalSteps.$inferSelect;
export type NewTraversalStep = typeof traversalSteps.$inferInsert;

/** Tree snapshot types */
export type TreeSnapshot = typeof treeSnapshots.$inferSelect;
export type NewTreeSnapshot = typeof treeSnapshots.$inferInsert;

// Template placeholders for entity templates
export const __entityPlural__ = treeNodes; // Placeholder for template
export type __Entity__ = TreeNode; // Placeholder for template
export type New__Entity__ = NewTreeNode; // Placeholder for template
