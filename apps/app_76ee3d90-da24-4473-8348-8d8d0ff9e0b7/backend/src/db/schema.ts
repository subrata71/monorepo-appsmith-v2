import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

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

/**
 * Items table for todo/task management
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Row returned by SELECTs */
export type Item = typeof items.$inferSelect;
/** Payload accepted by INSERTs */
export type NewItem = typeof items.$inferInsert;
