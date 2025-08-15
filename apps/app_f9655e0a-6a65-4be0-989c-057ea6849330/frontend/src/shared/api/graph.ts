import { get, post, put, del, handleError } from '@/shared/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  Graph, 
  NewGraph, 
  GraphUpdateRequest,
  GraphNode,
  GraphEdge
} from '@app/shared/api-types/graph';

// API functions
export const graphApi = {
  // Get graph by ID
  getGraph: async (id: string) => {
    const { data, error } = await get('/graphs/{id}', {
      params: {
        path: { id },
      },
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Create new graph
  createGraph: async (graphData: NewGraph) => {
    const { data, error } = await post('/graphs', {
      body: graphData,
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Update graph
  updateGraph: async (id: string, updates: GraphUpdateRequest) => {
    const { data, error } = await put('/graphs/{id}', {
      params: {
        path: { id },
      },
      body: updates,
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Delete graph
  deleteGraph: async (id: string) => {
    const { error } = await del('/graphs/{id}', {
      params: {
        path: { id },
      },
    });

    if (error) handleError(error);
  },

  // Add node to graph
  addNode: async (graphId: string, nodeData: { x: number; y: number; label?: string }) => {
    const { data, error } = await post('/graphs/{id}/nodes', {
      params: {
        path: { id: graphId },
      },
      body: nodeData,
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Add edge to graph
  addEdge: async (graphId: string, edgeData: { sourceId: string; targetId: string }) => {
    const { data, error } = await post('/graphs/{id}/edges', {
      params: {
        path: { id: graphId },
      },
      body: edgeData,
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Remove node from graph
  removeNode: async (graphId: string, nodeId: string) => {
    const { data, error } = await del('/graphs/{id}/nodes/{nodeId}', {
      params: {
        path: { id: graphId, nodeId },
      },
    });

    if (error) handleError(error);

    return data?.data;
  },

  // Remove edge from graph
  removeEdge: async (graphId: string, edgeId: string) => {
    const { data, error } = await del('/graphs/{id}/edges/{edgeId}', {
      params: {
        path: { id: graphId, edgeId },
      },
    });

    if (error) handleError(error);

    return data?.data;
  },
};

// Query hooks
export const useGraph = (id: string | null) =>
  useQuery({
    queryKey: ['graph', id],
    queryFn: () => id ? graphApi.getGraph(id) : null,
    enabled: !!id,
  });

// Mutation hooks
export const useCreateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: graphApi.createGraph,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphs'] });
    },
  });
};

export const useUpdateGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: GraphUpdateRequest }) => 
      graphApi.updateGraph(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['graph', variables.id] });
    },
  });
};

export const useDeleteGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: graphApi.deleteGraph,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['graph', id] });
      queryClient.invalidateQueries({ queryKey: ['graphs'] });
    },
  });
};

export const useAddNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ graphId, nodeData }: { 
      graphId: string; 
      nodeData: { x: number; y: number; label?: string; } 
    }) => graphApi.addNode(graphId, nodeData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['graph', variables.graphId] });
    },
  });
};

export const useAddEdge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ graphId, edgeData }: { 
      graphId: string; 
      edgeData: { sourceId: string; targetId: string; } 
    }) => graphApi.addEdge(graphId, edgeData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['graph', variables.graphId] });
    },
  });
};

export const useRemoveNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ graphId, nodeId }: { graphId: string; nodeId: string }) => 
      graphApi.removeNode(graphId, nodeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['graph', variables.graphId] });
    },
  });
};

export const useRemoveEdge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ graphId, edgeId }: { graphId: string; edgeId: string }) => 
      graphApi.removeEdge(graphId, edgeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['graph', variables.graphId] });
    },
  });
};