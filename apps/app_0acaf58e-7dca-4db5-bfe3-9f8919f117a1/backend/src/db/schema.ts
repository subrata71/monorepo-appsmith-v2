import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

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

// Daily entries table
export const dailyEntries = pgTable(
  'daily_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    entryDate: date('entry_date').notNull(),
    sentence: varchar('sentence', { length: 200 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    // Ensure one entry per user per date
    uniqueUserDate: uniqueIndex('unique_user_date').on(
      table.userId,
      table.entryDate
    ),
  })
);

// Types for daily entries
export type DailyEntry = typeof dailyEntries.$inferSelect;
export type NewDailyEntry = typeof dailyEntries.$inferInsert;
