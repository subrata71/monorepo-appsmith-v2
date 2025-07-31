import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { log } from '../utils/index.js';

// Request/Response schemas for validation
const addNodeSchema = {
  body: {
    type: 'object',
    required: ['value'],
    properties: {
      value: { type: 'number' }
    }
  }
};

const removeNodeSchema = {
  body: {
    type: 'object',
    required: ['value'],
    properties: {
      value: { type: 'number' }
    }
  }
};

const getTraversalSchema = {
  querystring: {
    type: 'object',
    required: ['traversalType'],
    properties: {
      traversalType: { 
        type: 'string',
        enum: ['inorder', 'preorder', 'postorder']
      }
    }
  }
};

export const treeRoute: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Get current tree structure
  app.get('/', async (request, reply) => {
    try {
      log.info('GET /tree - Getting tree structure');
      const result = await app.services.tree.getTree();
      return result;
    } catch (error) {
      log.error('Error getting tree:', error);
      reply.status(500);
      return { error: 'Failed to get tree structure' };
    }
  });

  // Add a node to the tree
  app.post('/add/node', { schema: addNodeSchema }, async (request, reply) => {
    try {
      const { value } = request.body as { value: number };
      
      log.info(`POST /tree/add-node - Adding node with value: ${value}`);
      
      // Validate input
      const validation = app.services.tree.validateNodeValue(value);
      if (!validation.isValid) {
        reply.status(400);
        return { error: validation.error };
      }

      const result = await app.services.tree.addNode(value);
      return result;
    } catch (error) {
      log.error('Error adding node:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        reply.status(409);
        return { error: error.message };
      }
      
      reply.status(500);
      return { error: 'Failed to add node' };
    }
  });

  // Remove a node from the tree
  app.post('/remove/node', { schema: removeNodeSchema }, async (request, reply) => {
    try {
      const { value } = request.body as { value: number };
      
      log.info(`POST /tree/remove-node - Removing node with value: ${value}`);
      
      const result = await app.services.tree.removeNode(value);
      return result;
    } catch (error) {
      log.error('Error removing node:', error);
      
      if (error instanceof Error && 
          (error.message.includes('not found') || error.message.includes('empty'))) {
        reply.status(404);
        return { error: error.message };
      }
      
      reply.status(500);
      return { error: 'Failed to remove node' };
    }
  });

  // Clear entire tree
  app.post('/clear', async (request, reply) => {
    try {
      log.info('POST /tree/clear - Clearing entire tree');
      const result = await app.services.tree.clearTree();
      return result;
    } catch (error) {
      log.error('Error clearing tree:', error);
      reply.status(500);
      return { error: 'Failed to clear tree' };
    }
  });

  // Get traversal steps for a specific traversal type
  app.get('/traversal/steps', { schema: getTraversalSchema }, async (request, reply) => {
    try {
      const { traversalType } = request.query as { traversalType: 'inorder' | 'preorder' | 'postorder' };
      
      log.info(`GET /tree/traversal-steps - Getting ${traversalType} traversal steps`);
      
      const steps = await app.services.tree.getTraversalSteps(traversalType);
      return { steps, traversalType };
    } catch (error) {
      log.error('Error getting traversal steps:', error);
      reply.status(500);
      return { error: 'Failed to get traversal steps' };
    }
  });

  // Validate a node value without adding it
  app.post('/validate', async (request, reply) => {
    try {
      const { value } = request.body as { value: any };
      
      log.info(`POST /tree/validate - Validating value: ${value}`);
      
      const validation = app.services.tree.validateNodeValue(value);
      return validation;
    } catch (error) {
      log.error('Error validating value:', error);
      reply.status(500);
      return { error: 'Failed to validate value' };
    }
  });

  // Undo last operation
  app.post('/undo', async (request, reply) => {
    try {
      log.info('POST /tree/undo - Undoing last operation');
      const result = await app.services.tree.undo();
      return result;
    } catch (error) {
      log.error('Error undoing operation:', error);
      
      if (error instanceof Error && error.message.includes('Nothing to undo')) {
        reply.status(400);
        return { error: error.message };
      }
      
      reply.status(500);
      return { error: 'Failed to undo operation' };
    }
  });

  // Redo last undone operation
  app.post('/redo', async (request, reply) => {
    try {
      log.info('POST /tree/redo - Redoing last undone operation');
      const result = await app.services.tree.redo();
      return result;
    } catch (error) {
      log.error('Error redoing operation:', error);
      
      if (error instanceof Error && error.message.includes('Nothing to redo')) {
        reply.status(400);
        return { error: error.message };
      }
      
      reply.status(500);
      return { error: 'Failed to redo operation' };
    }
  });

  // Get undo/redo status
  app.get('/undo/redo/status', async (request, reply) => {
    try {
      log.info('GET /tree/undo-redo-status - Getting undo/redo status');
      const status = app.services.tree.getUndoRedoStatus();
      return status;
    } catch (error) {
      log.error('Error getting undo/redo status:', error);
      reply.status(500);
      return { error: 'Failed to get undo/redo status' };
    }
  });
};