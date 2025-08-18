import { FastifyInstance } from 'fastify';
import healthRoutes from './health.route.js';
import gameRoutes from './game.route.js';

// Import template routes for testing
let entityTemplateRoutes: any = null;
if (process.env.NODE_ENV === 'test') {
  entityTemplateRoutes = await import('./__entity__.route.template.js');
}

export async function registerRoutes(app: FastifyInstance) {
  // Register all routes with /api/v1 prefix
  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(gameRoutes, { prefix: '/api/v1' });

  // Register template routes in test mode
  if (process.env.NODE_ENV === 'test' && entityTemplateRoutes) {
    await app.register(entityTemplateRoutes.default, { prefix: '/api/v1' });
  }
}

// Export individual route functions for direct use if needed
export { healthRoutes, gameRoutes };
