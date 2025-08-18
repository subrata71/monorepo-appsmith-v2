import * as schema from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { games, Game, NewGame } from '../db/schema.js';
import { log } from '../utils/index.js';

export const gameRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: NewGame) =>
    db
      .insert(games)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.games.findFirst({ where: eq(games.id, id) }),

  findAll: () => db.select().from(games),

  findTopScores: (limit: number = 10) =>
    db.select().from(games).orderBy(desc(games.score)).limit(limit),

  update: async (id: string, c: Partial<Game>) => {
    log.info('Updating game');
    const [updated] = await db
      .update(games)
      .set({ ...c, updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) =>
    db.delete(games).where(eq(games.id, id)),
});