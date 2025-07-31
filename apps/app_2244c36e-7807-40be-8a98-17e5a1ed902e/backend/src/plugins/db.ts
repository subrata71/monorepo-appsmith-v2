import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { FastifyInstance } from 'fastify';
import * as schema from '../db/schema.js';

export default fp(async (app: FastifyInstance) => {
  const pool = new pg.Pool({ connectionString: app.config.APP_DATABASE_URL });
  app.decorate('db', drizzle(pool, { schema }));
  app.addHook('onClose', async () => pool.end());
});
