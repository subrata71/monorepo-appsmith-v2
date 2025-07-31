import { Play, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui';
import { Card } from '@/shared/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { Label } from '@/shared/ui';
import { Separator } from '@/shared/ui';
import { useTreeVisualizerStore } from '@/shared/model/tree-visualizer-store';
import { useTraversalQuery, useTreeQuery } from '@/entities/tree';

export const TraversalControls = () => {
  const currentTraversalType = useTreeVisualizerStore(state => state.currentTraversalType);
  const currentStepIndex = useTreeVisualizerStore(state => state.currentStepIndex);
  const traversalSteps = useTreeVisualizerStore(state => state.traversalSteps);
  const isTraversalActive = useTreeVisualizerStore(state => state.isTraversalActive);
  
  const setTraversalType = useTreeVisualizerStore(state => state.setTraversalType);
  const setTraversalSteps = useTreeVisualizerStore(state => state.setTraversalSteps);
  const nextStep = useTreeVisualizerStore(state => state.nextStep);
  const previousStep = useTreeVisualizerStore(state => state.previousStep);
  const resetTraversal = useTreeVisualizerStore(state => state.resetTraversal);
  const setIsTraversalActive = useTreeVisualizerStore(state => state.setIsTraversalActive);

  const { data: treeData } = useTreeQuery();
  const { data: traversalData, isLoading: isLoadingTraversal } = useTraversalQuery(
    { traversalType: currentTraversalType! },
    !!currentTraversalType && !isTraversalActive
  );

  const hasNodes = treeData?.nodes && treeData.nodes.length > 0;
  const canStartTraversal = hasNodes && currentTraversalType && !isTraversalActive;
  const hasActiveTraversal = isTraversalActive && traversalSteps.length > 0;
  
  const canGoNext = hasActiveTraversal && currentStepIndex < traversalSteps.length - 1;
  const canGoPrevious = hasActiveTraversal && currentStepIndex >= 0;

  const handleTraversalTypeChange = (value: string) => {
    const type = value as 'inorder' | 'preorder' | 'postorder';
    setTraversalType(type);
    resetTraversal();
  };

  const handleStartTraversal = async () => {
    if (!currentTraversalType || !hasNodes) return;
    
    try {
      // The query will automatically fetch when currentTraversalType changes
      // and isTraversalActive is false
      if (traversalData?.steps) {
        setTraversalSteps(traversalData.steps);
        setIsTraversalActive(true);
      }
    } catch (error) {
      console.error('Failed to start traversal:', error);
    }
  };

  const handleResetTraversal = () => {
    resetTraversal();
    setTraversalType(null);
  };

  // Update traversal steps when data is fetched
  if (traversalData?.steps && !isTraversalActive && currentTraversalType) {
    setTraversalSteps(traversalData.steps);
    setIsTraversalActive(true);
  }

  const getCurrentStepInfo = () => {
    if (!hasActiveTraversal || currentStepIndex < 0) {
      return 'Ready to start';
    }
    
    const currentStep = traversalSteps[currentStepIndex];
    const nodeValue = treeData?.nodes.find(n => n.id === currentStep.nodeId)?.value;
    
    return `Step ${currentStepIndex + 1}/${traversalSteps.length}: Node ${nodeValue}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tree Traversal</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="traversal-type">Traversal Type</Label>
          <Select
            value={currentTraversalType || ''}
            onValueChange={handleTraversalTypeChange}
            disabled={isTraversalActive}
          >
            <SelectTrigger id="traversal-type">
              <SelectValue placeholder="Select traversal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inorder">Inorder (Left, Root, Right)</SelectItem>
              <SelectItem value="preorder">Preorder (Root, Left, Right)</SelectItem>
              <SelectItem value="postorder">Postorder (Left, Right, Root)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hasNodes && (
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            Add nodes to the tree to enable traversal
          </div>
        )}

        {hasNodes && !isTraversalActive && (
          <Button
            onClick={handleStartTraversal}
            disabled={!canStartTraversal || isLoadingTraversal}
            className="w-full"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isLoadingTraversal ? 'Loading...' : 'Start Traversal'}
          </Button>
        )}

        {hasActiveTraversal && (
          <>
            <Separator />
            
            <div className="text-sm font-medium text-center p-2 bg-blue-50 rounded">
              {getCurrentStepInfo()}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={previousStep}
                disabled={!canGoPrevious}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <SkipBack className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={!canGoNext}
                size="sm"
                className="flex-1"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Next
              </Button>
            </div>
            
            <Button
              onClick={handleResetTraversal}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Traversal
            </Button>
          </>
        )}

        {hasActiveTraversal && (
          <div className="text-xs text-gray-500">
            Traversal Order: {traversalSteps.map((step, index) => {
              const nodeValue = treeData?.nodes.find(n => n.id === step.nodeId)?.value;
              const isCurrentStep = index === currentStepIndex;
              const isVisited = index <= currentStepIndex;
              
              return (
                <span 
                  key={step.nodeId}
                  className={`inline-block mx-1 px-2 py-1 rounded ${
                    isCurrentStep 
                      ? 'bg-blue-500 text-white font-semibold' 
                      : isVisited 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {nodeValue}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};