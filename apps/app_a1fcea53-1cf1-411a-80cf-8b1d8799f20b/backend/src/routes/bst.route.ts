import type { FastifyInstance } from 'fastify';
import { BSTService } from '../services/bst.service.js';

export default async function bstRoutes(fastify: FastifyInstance) {
  const bstService = new BSTService(fastify);

  // Get all BST trees
  fastify.get('/bst', async (request, reply) => {
    try {
      const trees = await bstService.getTrees();
      return reply.send({ trees });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch BST trees' });
    }
  });

  // Create a new BST tree
  fastify.post('/bst', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { name } = request.body as { name: string };
      const tree = await bstService.createTree(name);
      return reply.status(201).send({ tree });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create BST tree' });
    }
  });

  // Get a specific BST tree with nodes
  fastify.get('/bst/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await bstService.getTreeWithNodes(id);
      
      if (!result) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch BST tree' });
    }
  });

  // Delete a BST tree
  fastify.delete('/bst/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await bstService.deleteTree(id);
      
      if (!deleted) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete BST tree' });
    }
  });

  // Insert a node into a BST tree
  fastify.post('/bst/:id/insert', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'integer', minimum: -999, maximum: 999 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { value } = request.body as { value: number };
      
      const result = await bstService.insertNode(id, value);
      if (!result) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      return reply.status(201).send(result);
    } catch (error) {
      fastify.log.error(error);
      if (error instanceof Error && error.message === 'Node with this value already exists') {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Failed to insert node' });
    }
  });

  // Delete a node from a BST tree
  fastify.post('/bst/:id/delete', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'integer', minimum: -999, maximum: 999 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { value } = request.body as { value: number };
      
      const result = await bstService.deleteNode(id, value);
      if (!result) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      if (error instanceof Error && error.message === 'Node not found') {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Failed to delete node' });
    }
  });

  // Search for a node in a BST tree
  fastify.post('/bst/:id/search', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'integer', minimum: -999, maximum: 999 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { value } = request.body as { value: number };
      
      const tree = await bstService.getTree(id);
      if (!tree) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      const result = await bstService.searchNode(id, value);
      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to search node' });
    }
  });

  // Reset a BST tree (remove all nodes)
  fastify.post('/bst/:id/reset', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const result = await bstService.resetTree(id);
      if (!result) {
        return reply.status(404).send({ error: 'BST tree not found' });
      }

      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to reset tree' });
    }
  });
}