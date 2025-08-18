import type { Task, NewTask } from '../db/schema';
import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { TaskFilters } from '../repositories/task.repo';
import { taskRepo } from '../repositories/task.repo';

export function makeTaskService(app: FastifyInstance) {
  const repo =
    app.repositories.task ?? taskRepo(app.db as NodePgDatabase<typeof schema>);

  return {
    // List tasks with filtering and sorting
    list: (filters?: TaskFilters) => repo.findAll(filters),

    // Get single task by ID
    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('Task not found');
      return found;
    },

    // Create new task
    async create(data: NewTask) {
      // If no order provided, get next order for the status
      if (data.order === undefined || data.order === null) {
        const nextOrder = await repo.getNextOrder(data.status || 'todo');
        data.order = nextOrder;
      }
      return repo.create(data);
    },

    // Update task (used for drag-and-drop)
    async update(id: string, changes: Partial<Task>) {
      const existingTask = await repo.findById(id);
      if (!existingTask) {
        throw new Error('Task not found');
      }

      // If status is changing, handle order reposition
      if (changes.status && changes.status !== existingTask.status) {
        // If moving to new status and no order specified, place at end
        if (changes.order === undefined || changes.order === null) {
          changes.order = await repo.getNextOrder(changes.status);
        }
      } else if (
        changes.order !== undefined &&
        changes.order !== existingTask.order
      ) {
        // Reordering within same status
        await repo.reorderTasks(
          existingTask.status,
          existingTask.order,
          changes.order
        );
      }

      return repo.update(id, changes);
    },

    // Delete task
    async remove(id: string) {
      const existingTask = await repo.findById(id);
      if (!existingTask) {
        throw new Error('Task not found');
      }

      return repo.delete(id);
    },

    // Get tasks grouped by status (useful for kanban board)
    async getGroupedByStatus() {
      const allTasks = await repo.findAll({
        sortBy: 'order',
        sortOrder: 'asc',
      });

      const grouped = {
        todo: [] as Task[],
        'in-progress': [] as Task[],
        done: [] as Task[],
      };

      allTasks.forEach(task => {
        if (task.status in grouped) {
          grouped[task.status as keyof typeof grouped].push(task);
        }
      });

      return grouped;
    },
  };
}

export type TaskService = ReturnType<typeof makeTaskService>;
