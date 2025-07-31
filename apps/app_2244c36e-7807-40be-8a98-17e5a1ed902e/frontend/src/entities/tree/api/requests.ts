import { api } from '@/shared/api';
import type { 
  TreeStructure, 
  AddNodeRequest, 
  RemoveNodeRequest, 
  TraversalResult, 
  TraversalQuery,
  ValidationResult 
} from '../model/types';

export const treeApi = {
  // Get current tree structure
  getTree: async (): Promise<TreeStructure> => {
    const response = await api.get('/tree');
    return response.data;
  },

  // Add a node to the tree
  addNode: async (request: AddNodeRequest): Promise<TreeStructure> => {
    const response = await api.post('/tree/add-node', request);
    return response.data;
  },

  // Remove a node from the tree
  removeNode: async (request: RemoveNodeRequest): Promise<TreeStructure> => {
    const response = await api.post('/tree/remove-node', request);
    return response.data;
  },

  // Clear entire tree
  clearTree: async (): Promise<TreeStructure> => {
    const response = await api.post('/tree/clear');
    return response.data;
  },

  // Get traversal steps
  getTraversalSteps: async (query: TraversalQuery): Promise<TraversalResult> => {
    const response = await api.get('/tree/traversal-steps', { 
      params: query 
    });
    return response.data;
  },

  // Validate node value
  validateValue: async (value: any): Promise<ValidationResult> => {
    const response = await api.post('/tree/validate', { value });
    return response.data;
  },
};