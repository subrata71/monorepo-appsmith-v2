import { pgTable, uuid, varchar, timestamp, text, boolean, jsonb, real } from 'drizzle-orm/pg-core';

// Don't delete this schema defintion. It is actually used in the app.
// Use this schema as a sample to define other tables in the app.
export const __entityPlural__ = pgTable('__entityPlural__', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Row returned by SELECTs
export type __Entity__ = typeof __entityPlural__.$inferSelect;
// Payload accepted by INSERTs
export type New__Entity__ = typeof __entityPlural__.$inferInsert;

// Graph schema
export const graphs = pgTable('graphs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adjacencyList: text('adjacency_list').notNull().default(''),
  isValid: boolean('is_valid').notNull().default(true),
  validationErrors: jsonb('validation_errors').notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// GraphNode schema
export const graphNodes = pgTable('graph_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  graphId: uuid('graph_id').references(() => graphs.id, { onDelete: 'cascade' }).notNull(),
  label: varchar('label', { length: 10 }).notNull(),
  x: real('x').notNull(),
  y: real('y').notNull(),
});

// GraphEdge schema
export const graphEdges = pgTable('graph_edges', {
  id: uuid('id').primaryKey().defaultRandom(),
  graphId: uuid('graph_id').references(() => graphs.id, { onDelete: 'cascade' }).notNull(),
  sourceId: uuid('source_id').references(() => graphNodes.id, { onDelete: 'cascade' }).notNull(),
  targetId: uuid('target_id').references(() => graphNodes.id, { onDelete: 'cascade' }).notNull(),
});

// Graph types
export type Graph = typeof graphs.$inferSelect;
export type NewGraph = typeof graphs.$inferInsert;
export type GraphNode = typeof graphNodes.$inferSelect;
export type NewGraphNode = typeof graphNodes.$inferInsert;
export type GraphEdge = typeof graphEdges.$inferSelect;
export type NewGraphEdge = typeof graphEdges.$inferInsert;
