import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treeApi } from './requests';
import type { 
  AddNodeRequest, 
  RemoveNodeRequest, 
  TraversalQuery 
} from '../model/types';

// Query keys
export const treeKeys = {
  all: ['tree'] as const,
  structure: () => [...treeKeys.all, 'structure'] as const,
  traversal: (type: string) => [...treeKeys.all, 'traversal', type] as const,
  undoRedoStatus: () => [...treeKeys.all, 'undo-redo-status'] as const,
};

// Get tree structure query
export const useTreeQuery = () => {
  return useQuery({
    queryKey: treeKeys.structure(),
    queryFn: treeApi.getTree,
    staleTime: 0, // Always refetch to ensure fresh data
  });
};

// Add node mutation
export const useAddNodeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: AddNodeRequest) => treeApi.addNode(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treeKeys.all });
    },
  });
};

// Remove node mutation
export const useRemoveNodeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: RemoveNodeRequest) => treeApi.removeNode(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treeKeys.all });
    },
  });
};

// Clear tree mutation
export const useClearTreeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => treeApi.clearTree(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treeKeys.all });
    },
  });
};

// Get traversal steps query
export const useTraversalQuery = (query: TraversalQuery, enabled = false) => {
  return useQuery({
    queryKey: treeKeys.traversal(query.traversalType),
    queryFn: () => treeApi.getTraversalSteps(query),
    enabled,
    staleTime: 30000, // Cache traversal results for 30 seconds
  });
};

// Validate value mutation
export const useValidateValueMutation = () => {
  return useMutation({
    mutationFn: (value: number) => treeApi.validateValue(value),
  });
};

// Undo/Redo status query
export const useUndoRedoStatusQuery = () => {
  return useQuery({
    queryKey: treeKeys.undoRedoStatus(),
    queryFn: treeApi.getUndoRedoStatus,
    staleTime: 0, // Always refetch to ensure fresh data
  });
};

// Undo mutation
export const useUndoMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => treeApi.undo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treeKeys.all });
    },
  });
};

// Redo mutation
export const useRedoMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => treeApi.redo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treeKeys.all });
    },
  });
};