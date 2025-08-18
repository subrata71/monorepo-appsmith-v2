import type * as schema from '../db/schema';
import { eq, asc, desc, and, gt, gte, lt, lte, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Task, NewTask } from '../db/schema';
import { tasks } from '../db/schema';
import { log } from '../utils/index';

export interface TaskFilters {
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'order' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const taskRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (taskData: NewTask) =>
    db
      .insert(tasks)
      .values(taskData)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.tasks.findFirst({ where: eq(tasks.id, id) }),

  findAll: async (filters: TaskFilters = {}) => {
    const {
      status,
      limit = 50,
      offset = 0,
      sortBy = 'order',
      sortOrder = 'asc',
    } = filters;

    // Build the base query
    const conditions = status ? eq(tasks.status, status) : undefined;

    // Apply sorting
    const sortColumn = tasks[sortBy];
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Execute query with all conditions
    const result = await db
      .select()
      .from(tasks)
      .where(conditions)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return result;
  },

  update: async (id: string, taskUpdate: Partial<Task>) => {
    log.info(`Updating task ${id}`);

    // Set updatedAt to current time
    const updateData = {
      ...taskUpdate,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) => db.delete(tasks).where(eq(tasks.id, id)),

  // Get next order number for a status
  getNextOrder: async (status: string) => {
    const result = await db
      .select({ maxOrder: tasks.order })
      .from(tasks)
      .where(eq(tasks.status, status))
      .orderBy(desc(tasks.order))
      .limit(1);

    return result[0]?.maxOrder ? result[0].maxOrder + 1 : 1;
  },

  // Reorder tasks within a status after a position change
  reorderTasks: async (status: string, fromOrder: number, toOrder: number) => {
    log.info(`Reordering tasks in ${status} from ${fromOrder} to ${toOrder}`);

    if (fromOrder < toOrder) {
      // Moving down - decrease order of items between fromOrder and toOrder
      await db
        .update(tasks)
        .set({ order: sql`${tasks.order} - 1` })
        .where(
          and(
            eq(tasks.status, status),
            gt(tasks.order, fromOrder),
            lte(tasks.order, toOrder)
          )
        );
    } else if (fromOrder > toOrder) {
      // Moving up - increase order of items between toOrder and fromOrder
      await db
        .update(tasks)
        .set({ order: sql`${tasks.order} + 1` })
        .where(
          and(
            eq(tasks.status, status),
            gte(tasks.order, toOrder),
            lt(tasks.order, fromOrder)
          )
        );
    }
  },
});
