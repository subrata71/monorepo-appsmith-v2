import { FastifyInstance } from 'fastify';
import healthRoutes from './health.route.js';
import { treeRoute } from './tree.route.js';

// Import template routes for testing
let entityTemplateRoutes: any = null;
if (process.env.NODE_ENV === 'test') {
  entityTemplateRoutes = await import('./__entity__.route.template.js');
}

export async function registerRoutes(app: FastifyInstance) {
  // Register all routes with /api/v1 prefix
  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(treeRoute, { prefix: '/api/v1/tree' });

  // Register template routes in test mode
  if (process.env.NODE_ENV === 'test' && entityTemplateRoutes) {
    await app.register(entityTemplateRoutes.default, { prefix: '/api/v1' });
  }
}

// Export individual route functions for direct use if needed
export { healthRoutes, treeRoute };
