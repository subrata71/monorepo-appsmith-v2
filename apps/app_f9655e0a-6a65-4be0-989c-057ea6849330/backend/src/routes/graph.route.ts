import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { GraphRoutes } from '@app/shared/api-types/graph';

export default async function graphRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // Grab the graph service from app.services
  const svc = app.services.graph;

  // Create a new graph
  app.post<GraphRoutes.Create>('/graphs', async (req, reply) => {
    try {
      const created = await svc.create(req.body);
      reply.code(201);
      return {
        data: {
          ...created,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      reply.code(400);
      throw error;
    }
  });

  // Get graph by ID
  app.get<GraphRoutes.GetById>('/graphs/:id', async (req, reply) => {
    try {
      const graph = await svc.get(req.params.id);
      return {
        data: {
          ...graph,
          createdAt: graph.createdAt.toISOString(),
          updatedAt: graph.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      reply.code(404);
      throw error;
    }
  });

  // Update graph
  app.put<GraphRoutes.Update>('/graphs/:id', async (req, reply) => {
    try {
      // Transform request body to include graphId for nodes and edges
      const updateData = {
        ...req.body,
        nodes: req.body.nodes?.map(node => ({
          ...node,
          graphId: req.params.id,
        })),
        edges: req.body.edges?.map(edge => ({
          ...edge,
          graphId: req.params.id,
        })),
      };
      const updated = await svc.update(req.params.id, updateData);
      return {
        data: {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('cycle') ||
          error.message.includes('Self-loop') ||
          error.message.includes('already exists'))
      ) {
        reply.code(400);
        throw error;
      }

      reply.code(404);
      throw error;
    }
  });

  // Delete graph
  app.delete<GraphRoutes.Delete>('/graphs/:id', async (req, reply) => {
    try {
      await svc.remove(req.params.id);
      reply.code(204);
    } catch (error) {
      reply.code(404);
    }
  });

  // Additional endpoints for node/edge operations

  // Add a node to the graph
  app.post<{
    Params: { id: string };
    Body: { x: number; y: number; label?: string };
    Reply: { data: any };
  }>('/graphs/:id/nodes', async (req, reply) => {
    try {
      const node = await svc.addNode(req.params.id, req.body);
      reply.code(201);
      return { data: node };
    } catch (error) {
      reply.code(400);
      throw error;
    }
  });

  // Add an edge to the graph
  app.post<{
    Params: { id: string };
    Body: { sourceId: string; targetId: string };
    Reply: { data: any };
  }>('/graphs/:id/edges', async (req, reply) => {
    try {
      const edge = await svc.addEdge(req.params.id, req.body);
      reply.code(201);
      return { data: edge };
    } catch (error) {
      reply.code(400);
      throw error;
    }
  });

  // Remove a node from the graph
  app.delete<{
    Params: { id: string; nodeId: string };
    Reply: void;
  }>('/graphs/:id/nodes/:nodeId', async (req, reply) => {
    try {
      await svc.removeNode(req.params.id, req.params.nodeId);
      reply.code(204);
    } catch (error) {
      reply.code(404);
    }
  });

  // Remove an edge from the graph
  app.delete<{
    Params: { id: string; edgeId: string };
    Reply: void;
  }>('/graphs/:id/edges/:edgeId', async (req, reply) => {
    try {
      await svc.removeEdge(req.params.id, req.params.edgeId);
      reply.code(204);
    } catch (error) {
      reply.code(404);
    }
  });
}
