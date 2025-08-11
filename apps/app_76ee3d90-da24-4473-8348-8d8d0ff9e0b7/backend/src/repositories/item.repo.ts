import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { items, Item, NewItem } from '../db/schema.js';
import { log } from '../utils/index.js';

export const itemRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: NewItem) =>
    db
      .insert(items)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.items.findFirst({ where: eq(items.id, id) }),

  findAll: () => db.select().from(items),

  update: async (id: string, c: Partial<Item>) => {
    log.info('Updating item');
    const [updated] = await db
      .update(items)
      .set(c)
      .where(eq(items.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) =>
    db.delete(items).where(eq(items.id, id)),

  /**
   * Mark an item as done by updating its status
   */
  markAsDone: async (id: string) => {
    log.info(`Marking item ${id} as done`);
    const [updated] = await db
      .update(items)
      .set({ 
        status: 'done',
        updatedAt: new Date()
      })
      .where(eq(items.id, id))
      .returning();
    return updated;
  },
});