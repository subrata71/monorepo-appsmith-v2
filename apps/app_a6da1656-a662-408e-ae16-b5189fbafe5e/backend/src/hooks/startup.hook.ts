import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { runMigrations } from '../db/migrations.js';
import { runSeeds } from '../seeds/index.js';
import { log } from '../utils/logger.js';

// Startup hook that runs database migrations and seeds before the server starts
// Fails startup if database setup fails
export default fp(async (app: FastifyInstance) => {
  app.addHook('onReady', async () => {
    try {
      log.info('Running database migrations on startup...');
      await runMigrations();
      log.info('Database migrations completed successfully');

      log.info('Running database seeds on startup...');
      await runSeeds();
      log.info('Database seeds completed successfully');

      log.info('✅ Database setup completed successfully');
    } catch (error: unknown) {
      const errorToLog =
        error instanceof Error ? error : new Error(String(error));
      log.error({ err: errorToLog }, 'Failed to run database setup');
      log.error('Failing startup due to database setup error');
      process.exit(1);
    }
  });
});
