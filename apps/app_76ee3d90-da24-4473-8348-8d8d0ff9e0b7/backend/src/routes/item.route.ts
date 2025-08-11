/**
 * Item Routes - API endpoints for item/todo management
 * Implements the endpoints specified in the technical specification
 */
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { ItemRoutes } from '../../../shared/api-types/item.js';

export default async function itemRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // Grab the item service from app.services
  const svc = app.services.item;

  /**
   * GET /items - Get all items (will be /api/v1/items with prefix)
   * Used to fetch the list of items for display
   */
  app.get<ItemRoutes.List>('/items', async () => {
    const items = await svc.getItems();
    return {
      data: items.map(item => ({
        ...item,
        status: item.status as 'pending' | 'done',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };
  });

  /**
   * GET /items/:id - Get a specific item
   */
  app.get<ItemRoutes.Get>('/items/:id', async req => {
    const item = await svc.getItem(req.params.id);
    return {
      data: {
        ...item,
        status: item.status as 'pending' | 'done',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };
  });

  /**
   * POST /items/{id}/markDone - Mark an item as done (will be /api/v1/items/{id}/markDone with prefix)
   * This is the key endpoint that triggers the event we need to detect
   * According to the tech spec, this should be: POST /api/items/{id}/markDone
   */
  app.post<ItemRoutes.MarkDone>(
    '/items/:id/markDone', 
    async (req, reply) => {
      const updatedItem = await svc.markItemDone(req.params.id);
      
      reply.code(200);
      return {
        data: {
          ...updatedItem,
          status: updatedItem.status as 'pending' | 'done',
          createdAt: updatedItem.createdAt.toISOString(),
          updatedAt: updatedItem.updatedAt.toISOString(),
        },
        message: 'Item marked as done successfully',
      };
    }
  );

  /**
   * POST /items - Create a new item
   */
  app.post<ItemRoutes.Create>('/items', async (req, reply) => {
    const created = await svc.createItem({
      title: req.body.title,
      status: req.body.status || 'pending',
    });
    
    reply.code(201);
    return {
      data: {
        ...created,
        status: created.status as 'pending' | 'done',
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };
  });

  /**
   * PUT /items/:id - Update an item
   */
  app.put<ItemRoutes.Update>('/items/:id', async req => {
    const updated = await svc.updateItem(req.params.id, req.body);
    return {
      data: {
        ...updated,
        status: updated.status as 'pending' | 'done',
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  });

  /**
   * DELETE /items/:id - Delete an item
   */
  app.delete<ItemRoutes.Delete>(
    '/items/:id',
    async (req, reply) => {
      await svc.removeItem(req.params.id);
      reply.code(204);
    }
  );
}