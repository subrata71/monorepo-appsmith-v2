/**
 * Daily Entry Repository
 *
 * Data access layer for daily entry operations
 */

import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  dailyEntries,
  type DailyEntry,
  type NewDailyEntry,
} from '../db/schema';

export class DailyEntryRepository {
  constructor(private db: NodePgDatabase<typeof import('../db/schema')>) {}

  /**
   * Find a daily entry by user ID and date
   */
  async findByUserAndDate(
    userId: string,
    entryDate: string
  ): Promise<DailyEntry | null> {
    const [entry] = await this.db
      .select()
      .from(dailyEntries)
      .where(
        and(
          eq(dailyEntries.userId, userId),
          eq(dailyEntries.entryDate, entryDate)
        )
      )
      .limit(1);

    return entry || null;
  }

  /**
   * Create a new daily entry
   */
  async create(data: NewDailyEntry): Promise<DailyEntry> {
    const [entry] = await this.db
      .insert(dailyEntries)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return entry;
  }

  /**
   * Update an existing daily entry
   */
  async update(
    userId: string,
    entryDate: string,
    sentence: string
  ): Promise<DailyEntry | null> {
    const [entry] = await this.db
      .update(dailyEntries)
      .set({
        sentence,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(dailyEntries.userId, userId),
          eq(dailyEntries.entryDate, entryDate)
        )
      )
      .returning();

    return entry || null;
  }

  /**
   * Get entries for a user with pagination
   */
  async findByUser(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<DailyEntry[]> {
    const { limit = 50, offset = 0 } = options;

    return await this.db
      .select()
      .from(dailyEntries)
      .where(eq(dailyEntries.userId, userId))
      .orderBy(dailyEntries.entryDate)
      .limit(limit)
      .offset(offset);
  }
}
