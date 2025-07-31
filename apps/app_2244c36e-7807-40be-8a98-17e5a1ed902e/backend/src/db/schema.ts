import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// Tree Nodes table - individual nodes in the binary tree
export const treeNodes = pgTable('tree_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: integer('value').notNull(),
  leftId: uuid('left_id').references(() => treeNodes.id),
  rightId: uuid('right_id').references(() => treeNodes.id),
  parentId: uuid('parent_id').references(() => treeNodes.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trees table - container for the binary tree structure
export const trees = pgTable('trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  rootId: uuid('root_id').references(() => treeNodes.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Traversal Steps table - for storing traversal sequences
export const traversalSteps = pgTable('traversal_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  nodeId: uuid('node_id').references(() => treeNodes.id).notNull(),
  order: integer('order').notNull(),
  traversalType: varchar('traversal_type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
