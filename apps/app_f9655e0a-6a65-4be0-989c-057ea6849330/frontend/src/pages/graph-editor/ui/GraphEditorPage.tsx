import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useGraphStore } from '@/entities/graph';
import { GraphCanvas } from '@/features/graph-canvas';
import { GraphToolbar } from '@/features/graph-toolbar';
import { GraphValidationPanel } from '@/features/graph-validation';
import { TextInputPanel } from '@/features/graph-text-input';
import { 
  useGraph, 
  useCreateGraph, 
  useAddNode, 
  useAddEdge, 
  useRemoveNode, 
  useRemoveEdge,
  useUpdateGraph
} from '@/shared/api/graph';
import type { CanvasPosition } from '@/entities/graph';
import { toast } from 'sonner';

export const GraphEditorPage = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  
  // Zustand store
  const currentGraph = useGraphStore(state => state.currentGraph);
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectedEdgeIds = useGraphStore(state => state.selectedEdgeIds);
  const mode = useGraphStore(state => state.mode);
  const undoStack = useGraphStore(state => state.undoStack);
  const redoStack = useGraphStore(state => state.redoStack);
  const setGraph = useGraphStore(state => state.setGraph);
  const setSelectedNodeIds = useGraphStore(state => state.setSelectedNodeIds);
  const setSelectedEdgeIds = useGraphStore(state => state.setSelectedEdgeIds);
  const clearSelection = useGraphStore(state => state.clearSelection);
  const setMode = useGraphStore(state => state.setMode);
  const pushToUndoStack = useGraphStore(state => state.pushToUndoStack);
  const undo = useGraphStore(state => state.undo);
  const redo = useGraphStore(state => state.redo);

  // API hooks
  const { data: graphData, isLoading, error } = useGraph(id);
  const createGraphMutation = useCreateGraph();
  const addNodeMutation = useAddNode();
  const addEdgeMutation = useAddEdge();
  const removeNodeMutation = useRemoveNode();
  const removeEdgeMutation = useRemoveEdge();
  const updateGraphMutation = useUpdateGraph();

  // Canvas dimensions
  const [canvasSize, setCanvasSize] = React.useState({ width: 800, height: 600 });

  // Update graph data when loaded
  React.useEffect(() => {
    if (graphData) {
      setGraph(graphData);
    }
  }, [graphData, setGraph]);

  // Create new graph if no ID provided
  React.useEffect(() => {
    if (!id && !isLoading) {
      createGraphMutation.mutate({
        nodes: [],
        edges: [],
        adjacencyList: '',
      });
    }
  }, [id, isLoading, createGraphMutation]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }
      
      // Mode shortcuts
      switch (e.key) {
        case 'Escape':
          setMode({ type: 'SELECT' });
          clearSelection();
          break;
        case '1':
          setMode({ type: 'SELECT' });
          break;
        case '2':
          setMode({ type: 'ADD_NODE' });
          break;
        case '3':
          setMode({ type: 'DRAW_EDGE' });
          break;
        case '4':
          setMode({ type: 'DELETE' });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode, clearSelection]);

  // Canvas event handlers
  const handleNodeAdd = React.useCallback(async (position: CanvasPosition) => {
    if (!currentGraph?.id) return;

    // Save current state for undo
    if (currentGraph) {
      pushToUndoStack(currentGraph);
    }

    try {
      const node = await addNodeMutation.mutateAsync({
        graphId: currentGraph.id,
        nodeData: position,
      });
      
      toast.success('Node added successfully');
    } catch (error) {
      toast.error('Failed to add node');
      console.error('Error adding node:', error);
    }
  }, [currentGraph, addNodeMutation, pushToUndoStack]);

  const handleEdgeDraw = React.useCallback(async (sourceId: string, targetId: string) => {
    if (!currentGraph?.id) return;

    // Save current state for undo
    if (currentGraph) {
      pushToUndoStack(currentGraph);
    }

    try {
      await addEdgeMutation.mutateAsync({
        graphId: currentGraph.id,
        edgeData: { sourceId, targetId },
      });
      
      toast.success('Edge added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add edge');
      console.error('Error adding edge:', error);
    }
  }, [currentGraph, addEdgeMutation, pushToUndoStack]);

  const handleNodeClick = React.useCallback((nodeId: string) => {
    if (mode.type === 'DELETE') {
      handleDelete(nodeId);
      return;
    }

    // Toggle selection
    const isSelected = selectedNodeIds.includes(nodeId);
    if (isSelected) {
      setSelectedNodeIds(selectedNodeIds.filter(id => id !== nodeId));
    } else {
      setSelectedNodeIds([...selectedNodeIds, nodeId]);
    }
  }, [mode.type, selectedNodeIds, setSelectedNodeIds]);

  const handleNodeMove = React.useCallback(async (nodeId: string, position: CanvasPosition) => {
    if (!currentGraph) return;

    // Update the node position locally
    const updatedNodes = currentGraph.nodes.map(node =>
      node.id === nodeId ? { ...node, x: position.x, y: position.y } : node
    );

    const updatedGraph = {
      ...currentGraph,
      nodes: updatedNodes,
    };

    setGraph(updatedGraph);

    // Update on server
    try {
      await updateGraphMutation.mutateAsync({
        id: currentGraph.id,
        updates: { nodes: updatedNodes },
      });
    } catch (error) {
      console.error('Error updating node position:', error);
      // Revert on error
      setGraph(currentGraph);
    }
  }, [currentGraph, updateGraphMutation, setGraph]);

  const handleCanvasClick = React.useCallback((position: CanvasPosition) => {
    // Clear selection when clicking on empty canvas
    clearSelection();
  }, [clearSelection]);

  const handleDelete = React.useCallback(async (itemId: string) => {
    if (!currentGraph?.id) return;

    // Save current state for undo
    if (currentGraph) {
      pushToUndoStack(currentGraph);
    }

    const isNode = currentGraph.nodes.some(n => n.id === itemId);
    const isEdge = currentGraph.edges.some(e => e.id === itemId);

    try {
      if (isNode) {
        await removeNodeMutation.mutateAsync({
          graphId: currentGraph.id,
          nodeId: itemId,
        });
        toast.success('Node deleted successfully');
      } else if (isEdge) {
        await removeEdgeMutation.mutateAsync({
          graphId: currentGraph.id,
          edgeId: itemId,
        });
        toast.success('Edge deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  }, [currentGraph, removeNodeMutation, removeEdgeMutation, pushToUndoStack]);

  const handleUndo = React.useCallback(() => {
    const previousGraph = undo();
    if (previousGraph && currentGraph?.id) {
      updateGraphMutation.mutate({
        id: currentGraph.id,
        updates: {
          nodes: previousGraph.nodes,
          edges: previousGraph.edges,
        },
      });
    }
  }, [undo, currentGraph, updateGraphMutation]);

  const handleRedo = React.useCallback(() => {
    const nextGraph = redo();
    if (nextGraph && currentGraph?.id) {
      updateGraphMutation.mutate({
        id: currentGraph.id,
        updates: {
          nodes: nextGraph.nodes,
          edges: nextGraph.edges,
        },
      });
    }
  }, [redo, currentGraph, updateGraphMutation]);

  // Create new graph
  const handleCreateNewGraph = React.useCallback(() => {
    createGraphMutation.mutate({
      nodes: [],
      edges: [],
      adjacencyList: '',
    });
  }, [createGraphMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load graph</p>
          <Button onClick={handleCreateNewGraph}>Create New Graph</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Graph Editor</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCreateNewGraph}>
            New Graph
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <GraphToolbar
        mode={mode}
        onModeChange={setMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        selectedNodeCount={selectedNodeIds.length}
        selectedEdgeCount={selectedEdgeIds.length}
      />

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
          <GraphCanvas
            width={canvasSize.width}
            height={canvasSize.height}
            graph={currentGraph}
            selectedNodeIds={selectedNodeIds}
            selectedEdgeIds={selectedEdgeIds}
            mode={mode}
            onNodeClick={handleNodeClick}
            onNodeAdd={handleNodeAdd}
            onEdgeDraw={handleEdgeDraw}
            onNodeMove={handleNodeMove}
            onCanvasClick={handleCanvasClick}
          />
        </div>

        {/* Right panel with tabs */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <Tabs defaultValue="text-input" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 m-0 rounded-none border-b">
              <TabsTrigger value="text-input" className="rounded-none">Text Input</TabsTrigger>
              <TabsTrigger value="validation" className="rounded-none">Validation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-input" className="flex-1 m-0 p-0">
              <TextInputPanel className="h-full" />
            </TabsContent>
            
            <TabsContent value="validation" className="flex-1 m-0 p-0">
              <GraphValidationPanel graph={currentGraph} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
});