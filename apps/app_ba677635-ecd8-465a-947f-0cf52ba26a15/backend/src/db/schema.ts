import { pgTable, uuid, varchar, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

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

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  grid: jsonb('grid').notNull(), // 4x4 array of numbers
  score: integer('score').notNull().default(0),
  bestScore: integer('best_score').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('playing'), // 'playing', 'won', 'lost'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Row returned by SELECTs */
export type Game = typeof games.$inferSelect;
/** Payload accepted by INSERTs */
export type NewGame = typeof games.$inferInsert;
