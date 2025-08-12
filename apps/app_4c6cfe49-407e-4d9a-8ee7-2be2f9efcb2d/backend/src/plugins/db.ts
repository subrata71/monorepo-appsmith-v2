import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { FastifyInstance } from 'fastify';
import * as schema from '../db/schema.js';

export const dbPlugin = (app: FastifyInstance) => {
  let pool: pg.Pool;
  let db: NodePgDatabase<typeof schema>;

  try {
    pool = new pg.Pool({ connectionString: app.config.APP_DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to initialize database connection: ${message}`);
  }

  // Initialize immediately during construction (like repositories/services)
  app.decorate('db', db);
  app.addHook('onClose', async () => {
    try {
      await pool.end();
    } catch (error) {
      app.log.error('Error closing database pool:', error);
    }
  });

  return {
    name: 'db',
    db,
    pool,
    // Note: Cleanup handled automatically by onClose hook above
  };
};
