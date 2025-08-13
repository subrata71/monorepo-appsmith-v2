// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new repositories (e.g., user.repo.ts)

import type * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { __Entity__, New__Entity__ } from '../db/schema.js';
import { __entityPlural__ } from '../db/schema.js';
import { log } from '../utils/index.js';

export const __entity__Repo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: New__Entity__) =>
    db
      .insert(__entityPlural__)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.__entityPlural__.findFirst({ where: eq(__entityPlural__.id, id) }),

  findAll: () => db.select().from(__entityPlural__),

  update: async (id: string, c: Partial<__Entity__>) => {
    log.info('Updating entity');
    const [updated] = await db
      .update(__entityPlural__)
      .set(c)
      .where(eq(__entityPlural__.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) =>
    db.delete(__entityPlural__).where(eq(__entityPlural__.id, id)),
});
