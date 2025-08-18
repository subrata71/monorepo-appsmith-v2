import type * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { User, NewUser } from '../db/schema';
import { users } from '../db/schema';
import { log } from '../utils/index';

export const userRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (userData: NewUser): Promise<User> =>
    db
      .insert(users)
      .values(userData)
      .returning()
      .then(r => r[0]),

  findById: (id: string): Promise<User | undefined> =>
    db.query.users.findFirst({ where: eq(users.id, id) }),

  findByEmail: (email: string): Promise<User | undefined> =>
    db.query.users.findFirst({ where: eq(users.email, email) }),

  findAll: (): Promise<User[]> => db.select().from(users),

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    log.info('Updating user');
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) => db.delete(users).where(eq(users.id, id)),
});
