import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { runMigrations } from '../db/migrations.js';
import { log } from '../utils/logger.js';

/**
 * Startup hook that runs database migrations before the server starts
 */
export default fp(async (app: FastifyInstance) => {
  app.addHook('onReady', async () => {
    try {
      log.info('Running database migrations on startup...');
      await runMigrations(app.config.APP_DATABASE_URL);
      log.info('Database migrations completed successfully');
    } catch (error) {
      log.error('Failed to run database migrations:', error);
      // Don't exit the process, but log the error
      // The server can still start, but migrations will need to be run manually
    }
  });
});
