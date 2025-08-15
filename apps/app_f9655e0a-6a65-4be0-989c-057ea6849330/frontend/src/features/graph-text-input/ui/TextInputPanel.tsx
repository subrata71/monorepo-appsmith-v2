import React from 'react';
import { AdjacencyListInput } from './AdjacencyListInput';
import { TextInputActions } from './TextInputActions';
import { parseAdjacencyList, validateAdjacencyListFormat } from '@/shared/lib/graph-parser';
import { useGraphStore } from '@/entities/graph';
import { useUpdateGraph } from '@/shared/api/graph';
import { toast } from 'sonner';

interface TextInputPanelProps {
  className?: string;
}

export const TextInputPanel = React.memo<TextInputPanelProps>(({ className }) => {
  const currentGraph = useGraphStore(state => state.currentGraph);
  const pendingAdjacencyList = useGraphStore(state => state.pendingAdjacencyList);
  const textInputDirty = useGraphStore(state => state.textInputDirty);
  const setPendingAdjacencyList = useGraphStore(state => state.setPendingAdjacencyList);
  const resetTextInput = useGraphStore(state => state.resetTextInput);
  const pushToUndoStack = useGraphStore(state => state.pushToUndoStack);
  
  const updateGraphMutation = useUpdateGraph();

  // Initialize text input when graph loads or when the graph is updated externally
  React.useEffect(() => {
    if (currentGraph && !textInputDirty) {
      resetTextInput();
    }
  }, [currentGraph?.id, currentGraph?.nodes?.length, currentGraph?.edges?.length]); // Sync when graph structure changes

  const handleTextChange = React.useCallback((text: string) => {
    setPendingAdjacencyList(text);
  }, [setPendingAdjacencyList]);

  const handleApply = React.useCallback(async () => {
    if (!currentGraph?.id) {
      toast.error('No graph selected');
      return;
    }

    const parseResult = parseAdjacencyList(pendingAdjacencyList);
    
    if (!parseResult.success) {
      toast.error('Cannot apply invalid adjacency list');
      return;
    }
    
    // Double-check for cycles and other validation issues
    const validationResult = validateAdjacencyListFormat(pendingAdjacencyList);
    if (!validationResult.isValid) {
      toast.error(`Invalid graph: ${validationResult.errors[0] || 'Unknown validation error'}`);
      return;
    }

    // Save current state for undo
    if (currentGraph) {
      pushToUndoStack(currentGraph);
    }

    try {
      // For now, we'll only send the adjacency list to the backend
      // The backend will need to be updated to parse the adjacency list 
      // and create nodes/edges from it
      await updateGraphMutation.mutateAsync({
        id: currentGraph.id,
        updates: {
          adjacencyList: pendingAdjacencyList,
        },
      });

      toast.success('Graph updated from adjacency list');
    } catch (error) {
      console.error('Error applying adjacency list:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to apply changes');
    }
  }, [currentGraph, pendingAdjacencyList, updateGraphMutation, pushToUndoStack]);

  const handleClear = React.useCallback(() => {
    setPendingAdjacencyList('');
  }, [setPendingAdjacencyList]);

  const handleReset = React.useCallback(() => {
    resetTextInput();
    toast.success('Text input reset to current graph');
  }, [resetTextInput]);

  // Check if we can apply (valid format with comprehensive validation including cycles)
  const validation = React.useMemo(() => {
    return validateAdjacencyListFormat(pendingAdjacencyList);
  }, [pendingAdjacencyList]);

  const canApply = validation.isValid && textInputDirty;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 p-4">
        <AdjacencyListInput
          value={pendingAdjacencyList}
          onChange={handleTextChange}
        />
      </div>
      
      <div className="px-4 pb-4">
        <TextInputActions
          onApply={handleApply}
          onClear={handleClear}
          onReset={handleReset}
          canApply={canApply}
          isLoading={updateGraphMutation.isPending}
          isDirty={textInputDirty}
        />
      </div>
    </div>
  );
});