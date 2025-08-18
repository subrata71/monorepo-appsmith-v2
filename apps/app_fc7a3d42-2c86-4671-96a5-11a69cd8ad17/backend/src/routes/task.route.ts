import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { TaskRoutes } from '@app/shared/api-types/task';

export default async function taskRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // Grab the task service from app.services
  const svc = app.services.task;

  // GET /tasks - List all tasks with optional filtering
  app.get<TaskRoutes.List>('/tasks', async req => {
    const {
      status,
      limit = 50,
      offset = 0,
      sortBy = 'order',
      sortOrder = 'asc',
    } = req.query;

    const tasks = await svc.list({
      status,
      limit: Number(limit),
      offset: Number(offset),
      sortBy,
      sortOrder,
    });

    return {
      data: tasks.map(task => ({
        ...task,
        status: task.status as 'todo' | 'in-progress' | 'done',
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })),
    };
  });

  // GET /tasks/:id - Get single task by ID
  app.get<TaskRoutes.GetById>('/tasks/:id', async req => {
    const task = await svc.get(req.params.id);
    return {
      data: {
        ...task,
        status: task.status as 'todo' | 'in-progress' | 'done',
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    };
  });

  // POST /tasks - Create new task
  app.post<TaskRoutes.Create>('/tasks', async (req, reply) => {
    const created = await svc.create(req.body as any);
    reply.code(201);
    return {
      data: {
        ...created,
        status: created.status as 'todo' | 'in-progress' | 'done',
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };
  });

  // PATCH /tasks/:id - Update task (used for drag-and-drop)
  app.patch<TaskRoutes.Update>('/tasks/:id', async (req, reply) => {
    try {
      const updated = await svc.update(req.params.id, req.body as any);
      return {
        data: {
          ...updated,
          status: updated.status as 'todo' | 'in-progress' | 'done',
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return reply.code(404).send();
      }
      throw error;
    }
  });

  // DELETE /tasks/:id - Delete task
  app.delete<TaskRoutes.Delete>('/tasks/:id', async (req, reply) => {
    try {
      await svc.remove(req.params.id);
      reply.code(204);
    } catch (error) {
      if (error instanceof Error && error.message === 'Task not found') {
        return reply.code(404);
      }
      throw error;
    }
  });
}
