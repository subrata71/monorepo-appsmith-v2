import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

/**
 * Don't delete this schema defintion. It is actually used in the app.
 * Use this schema as a sample to define other tables in the app.
 */
export const __entityPlural__ = pgTable('__entityPlural__', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/** Row returned by SELECTs */
export type __Entity__ = typeof __entityPlural__.$inferSelect;
/** Payload accepted by INSERTs */
export type New__Entity__ = typeof __entityPlural__.$inferInsert;

// BST Node table
export const bstNodes = pgTable('bst_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: integer('value').notNull(),
  leftNodeId: uuid('left_node_id'),
  rightNodeId: uuid('right_node_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// BST Tree table
export const bstTrees = pgTable('bst_trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  rootNodeId: uuid('root_node_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BSTNode = typeof bstNodes.$inferSelect;
export type NewBSTNode = typeof bstNodes.$inferInsert;
export type BSTTree = typeof bstTrees.$inferSelect;
export type NewBSTTree = typeof bstTrees.$inferInsert;
