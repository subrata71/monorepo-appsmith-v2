// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new routes (e.g., user.route.ts)
//
// Fastify plugin for <Entity> routes
// Copy ➜ src/routes/user.route.ts ; replace tokens; remove "-template" suffix.
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { __Entity__Routes } from '@app/shared/api-types/__entity__.js';

export default async function __entity__Routes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // 👇 grab the service from app.services (fully typed via your augmentation)
  const svc = app.services.__entity__;

  app.get<__Entity__Routes.List>('/__entityPlural__', async () => {
    const entities = await svc.list();
    return {
      data: entities.map(entity => ({
        ...entity,
        createdAt: entity.createdAt.toISOString(),
      })),
    };
  });

  app.get<__Entity__Routes.Get>('/__entityPlural__/:id', async req => {
    const entity = await svc.get(req.params.id);
    return {
      data: {
        ...entity,
        createdAt: entity.createdAt.toISOString(),
      },
    };
  });

  app.post<__Entity__Routes.Create>('/__entityPlural__', async (req, reply) => {
    const created = await svc.create(req.body);
    reply.code(201);
    return {
      data: {
        ...created,
        createdAt: created.createdAt.toISOString(),
      },
    };
  });

  app.put<__Entity__Routes.Update>('/__entityPlural__/:id', async req => {
    const updated = await svc.update(req.params.id, req.body);
    return {
      data: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
      },
    };
  });

  app.delete<__Entity__Routes.Delete>(
    '/__entityPlural__/:id',
    async (req, reply) => {
      await svc.remove(req.params.id);
      reply.code(204);
    }
  );
}
