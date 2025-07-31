import { Plus, Minus, Trash2, Undo, Redo } from 'lucide-react';
import { Button, Card, Separator } from '@/shared/ui';
import { useTreeVisualizerStore } from '@/shared/model/tree-visualizer-store';
import { 
  useAddNodeMutation, 
  useRemoveNodeMutation, 
  useClearTreeMutation,
  useTreeQuery,
  useUndoMutation,
  useRedoMutation,
  useUndoRedoStatusQuery
} from '@/entities/tree';
import { NodeInput } from './NodeInput';

export const TreeControls = () => {
  const inputValue = useTreeVisualizerStore(state => state.inputValue);
  const isInputValid = useTreeVisualizerStore(state => state.isInputValid);
  const isAnimating = useTreeVisualizerStore(state => state.isAnimating);
  const clearInput = useTreeVisualizerStore(state => state.clearInput);
  const setIsAnimating = useTreeVisualizerStore(state => state.setIsAnimating);

  const { data: treeData } = useTreeQuery();
  const { data: undoRedoStatus } = useUndoRedoStatusQuery();
  const addNodeMutation = useAddNodeMutation();
  const removeNodeMutation = useRemoveNodeMutation();
  const clearTreeMutation = useClearTreeMutation();
  const undoMutation = useUndoMutation();
  const redoMutation = useRedoMutation();

  const handleValueChange = () => {
    // Value changes are handled by the NodeInput component
  };

  const handleAddNode = async () => {
    if (!isInputValid || inputValue.trim() === '') return;
    
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    
    try {
      setIsAnimating(true);
      await addNodeMutation.mutateAsync({ value });
      clearInput();
    } catch (error) {
      console.error('Failed to add node:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleRemoveNode = async () => {
    if (!isInputValid || inputValue.trim() === '') return;
    
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;
    
    try {
      setIsAnimating(true);
      await removeNodeMutation.mutateAsync({ value });
      clearInput();
    } catch (error) {
      console.error('Failed to remove node:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleClearTree = async () => {
    try {
      setIsAnimating(true);
      await clearTreeMutation.mutateAsync();
      clearInput();
    } catch (error) {
      console.error('Failed to clear tree:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleUndo = async () => {
    try {
      setIsAnimating(true);
      await undoMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to undo:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleRedo = async () => {
    try {
      setIsAnimating(true);
      await redoMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to redo:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const hasNodes = treeData?.nodes && treeData.nodes.length > 0;
  const canAddNode = isInputValid && inputValue.trim() !== '' && !isAnimating;
  const canRemoveNode = canAddNode && hasNodes;
  const canClearTree = hasNodes && !isAnimating;
  const canUndo = undoRedoStatus?.canUndo && !isAnimating;
  const canRedo = undoRedoStatus?.canRedo && !isAnimating;

  const isLoading = addNodeMutation.isPending || 
                   removeNodeMutation.isPending || 
                   clearTreeMutation.isPending ||
                   undoMutation.isPending ||
                   redoMutation.isPending;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tree Controls</h3>
      
      <div className="space-y-4">
        <NodeInput
          onValueChange={handleValueChange}
          isDisabled={isAnimating || isLoading}
          placeholder="Enter integer value"
        />

        <div className="space-y-2">
          <Button
            onClick={handleAddNode}
            disabled={!canAddNode || isLoading}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>

          <Button
            onClick={handleRemoveNode}
            disabled={!canRemoveNode || isLoading}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Minus className="w-4 h-4 mr-2" />
            Remove Node
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleUndo}
            disabled={!canUndo || isLoading}
            variant="outline"
            size="sm"
          >
            <Undo className="w-4 h-4 mr-1" />
            Undo
          </Button>

          <Button
            onClick={handleRedo}
            disabled={!canRedo || isLoading}
            variant="outline"
            size="sm"
          >
            <Redo className="w-4 h-4 mr-1" />
            Redo
          </Button>
        </div>

        <Separator />

        <Button
          onClick={handleClearTree}
          disabled={!canClearTree || isLoading}
          variant="destructive"
          className="w-full"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Tree
        </Button>

        {(addNodeMutation.error || removeNodeMutation.error || clearTreeMutation.error || undoMutation.error || redoMutation.error) && (
          <div className="text-sm text-red-600 mt-2">
            {addNodeMutation.error?.message || 
             removeNodeMutation.error?.message || 
             clearTreeMutation.error?.message ||
             undoMutation.error?.message ||
             redoMutation.error?.message}
          </div>
        )}

        {hasNodes && (
          <div className="text-sm text-gray-600 mt-2">
            Total nodes: {treeData.nodes.length}
          </div>
        )}
      </div>
    </Card>
  );
};