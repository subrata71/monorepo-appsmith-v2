import { FastifyInstance, FastifyPluginOptions } from 'fastify';

/**
 * Fastify plugin for Game routes
 */
export default async function gameRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  const svc = app.services.game;

  // Initialize a new game
  app.post('/games/init', async (req, reply) => {
    const game = await svc.initGame();
    reply.code(201);
    return game;
  });

  // Make a move in the game
  app.post<{
    Params: { id: string };
    Body: { direction: 'up' | 'down' | 'left' | 'right' };
  }>('/games/:id/move', async (req, reply) => {
    const { id } = req.params;
    const { direction } = req.body;
    
    try {
      const updatedGame = await svc.move(id, direction);
      return updatedGame;
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        reply.code(404);
        return { error: 'Game not found' };
      }
      if (error instanceof Error && error.message === 'Game is not in playing state') {
        reply.code(400);
        return { error: 'Game is not in playing state' };
      }
      throw error;
    }
  });

  // Reset/restart a game
  app.post<{ Params: { id: string } }>('/games/:id/reset', async req => {
    const { id } = req.params;
    return svc.reset(id);
  });

  // Get game state
  app.get<{ Params: { id: string } }>('/games/:id', async (req, reply) => {
    try {
      return await svc.get(req.params.id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        reply.code(404);
        return { error: 'Game not found' };
      }
      throw error;
    }
  });

  // Get leaderboard (top scores)
  app.get<{ Querystring: { limit?: number } }>('/games/leaderboard', async req => {
    const limit = req.query.limit || 10;
    return svc.getLeaderboard(limit);
  });

  // List all games
  app.get('/games', () => svc.list());
}