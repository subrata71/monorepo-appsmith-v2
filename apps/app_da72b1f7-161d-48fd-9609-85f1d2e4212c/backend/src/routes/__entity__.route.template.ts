import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { New__Entity__ } from '../db/schema.js';

/**
 * ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
 * Copy this file to create new routes (e.g., user.route.ts)
 *
 * Fastify plugin for <Entity> routes
 * Copy ➜ src/routes/user.route.ts ; replace tokens; remove "-template" suffix.
 */
export default async function __entity__Routes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // 👇 grab the service from app.services (fully typed via your augmentation)
  const svc = app.services.__entity__;

  app.get('/__entityPlural__', () => svc.list());

  app.get<{ Params: { id: string } }>('/__entityPlural__/:id', req =>
    svc.get(req.params.id)
  );

  app.post<{ Body: New__Entity__ }>('/__entityPlural__', async (req, reply) => {
    const created = await svc.create(req.body);
    reply.code(201);
    return created;
  });

  app.put<{
    Params: { id: string };
    Body: Partial<New__Entity__>;
  }>('/__entityPlural__/:id', req => svc.update(req.params.id, req.body));

  app.delete<{ Params: { id: string } }>(
    '/__entityPlural__/:id',
    async (req, reply) => {
      await svc.remove(req.params.id);
      reply.code(204);
    }
  );
}
