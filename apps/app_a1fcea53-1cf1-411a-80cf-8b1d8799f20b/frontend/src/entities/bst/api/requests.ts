import { api } from '@/shared/api';

export interface BSTNode {
  id: string;
  value: number;
  leftNodeId: string | null;
  rightNodeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BSTTree {
  id: string;
  name: string;
  rootNodeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BSTreeWithNodes {
  tree: BSTTree;
  nodes: BSTNode[];
}

export interface SearchResult {
  found: boolean;
  path: string[];
  node?: BSTNode;
}

export const bstApi = {
  // Get all BST trees
  getTrees: async (): Promise<{ trees: BSTTree[] }> => {
    const response = await api.get('/bst');
    return response.data;
  },

  // Create a new BST tree
  createTree: async (name: string): Promise<{ tree: BSTTree }> => {
    const response = await api.post('/bst', { name });
    return response.data;
  },

  // Get a specific tree with nodes
  getTree: async (id: string): Promise<BSTreeWithNodes> => {
    const response = await api.get(`/bst/${id}`);
    return response.data;
  },

  // Delete a BST tree
  deleteTree: async (id: string): Promise<void> => {
    await api.delete(`/bst/${id}`);
  },

  // Insert node into tree
  insertNode: async (treeId: string, value: number): Promise<BSTreeWithNodes> => {
    const response = await api.post(`/bst/${treeId}/insert`, { value });
    return response.data;
  },

  // Delete node from tree
  deleteNode: async (treeId: string, value: number): Promise<BSTreeWithNodes> => {
    const response = await api.post(`/bst/${treeId}/delete`, { value });
    return response.data;
  },

  // Search for node in tree
  searchNode: async (treeId: string, value: number): Promise<SearchResult> => {
    const response = await api.post(`/bst/${treeId}/search`, { value });
    return response.data;
  },

  // Reset tree (remove all nodes)
  resetTree: async (treeId: string): Promise<BSTreeWithNodes> => {
    const response = await api.post(`/bst/${treeId}/reset`);
    return response.data;
  },
};