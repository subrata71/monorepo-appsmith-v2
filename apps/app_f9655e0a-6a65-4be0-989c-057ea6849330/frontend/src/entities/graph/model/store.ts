import { create } from 'zustand';
import type { Graph, GraphNode, GraphEdge, GraphEditorMode } from './types';

interface GraphState {
  // Current graph data
  currentGraph: Graph | null;
  
  // UI state
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  mode: GraphEditorMode;
  isLoading: boolean;
  error: string | null;
  
  // Undo/redo stacks  
  undoStack: Graph[];
  redoStack: Graph[];
  
  // Temporary edge drawing state
  edgeDrawSource: string | null;
}

interface GraphActions {
  // Graph data actions
  setGraph: (graph: Graph | null) => void;
  clearGraph: () => void;
  
  // UI actions
  setSelectedNodeIds: (nodeIds: string[]) => void;
  setSelectedEdgeIds: (edgeIds: string[]) => void;
  addSelectedNodeId: (nodeId: string) => void;
  addSelectedEdgeId: (edgeId: string) => void;
  clearSelection: () => void;
  setMode: (mode: GraphEditorMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Undo/redo actions
  pushToUndoStack: (graph: Graph) => void;
  pushToRedoStack: (graph: Graph) => void;
  undo: () => Graph | null;
  redo: () => Graph | null;
  clearHistory: () => void;
  
  // Edge drawing actions
  setEdgeDrawSource: (nodeId: string | null) => void;
  
  // Helper actions
  getNodeById: (nodeId: string) => GraphNode | null;
  getEdgeById: (edgeId: string) => GraphEdge | null;
}

type GraphStore = GraphState & GraphActions;

export const useGraphStore = create<GraphStore>((set, get) => ({
  // Initial state
  currentGraph: null,
  selectedNodeIds: [],
  selectedEdgeIds: [],
  mode: { type: 'SELECT' },
  isLoading: false,
  error: null,
  undoStack: [],
  redoStack: [],
  edgeDrawSource: null,
  
  // Graph data actions
  setGraph: (graph) => set({ currentGraph: graph }),
  
  clearGraph: () => set({
    currentGraph: null,
    selectedNodeIds: [],
    selectedEdgeIds: [],
    undoStack: [],
    redoStack: [],
    edgeDrawSource: null,
    error: null,
  }),
  
  // UI actions
  setSelectedNodeIds: (nodeIds) => set({ selectedNodeIds: nodeIds }),
  
  setSelectedEdgeIds: (edgeIds) => set({ selectedEdgeIds: edgeIds }),
  
  addSelectedNodeId: (nodeId) => set((state) => ({
    selectedNodeIds: [...state.selectedNodeIds, nodeId],
  })),
  
  addSelectedEdgeId: (edgeId) => set((state) => ({
    selectedEdgeIds: [...state.selectedEdgeIds, edgeId],
  })),
  
  clearSelection: () => set({
    selectedNodeIds: [],
    selectedEdgeIds: [],
  }),
  
  setMode: (mode) => set({ 
    mode,
    // Clear edge drawing state when changing modes
    edgeDrawSource: mode.type === 'DRAW_EDGE' ? get().edgeDrawSource : null,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  // Undo/redo actions
  pushToUndoStack: (graph) => set((state) => ({
    undoStack: [...state.undoStack.slice(-19), graph], // Keep last 20 states
    redoStack: [], // Clear redo stack when new action is performed
  })),
  
  pushToRedoStack: (graph) => set((state) => ({
    redoStack: [...state.redoStack.slice(-19), graph], // Keep last 20 states
  })),
  
  undo: () => {
    const state = get();
    if (state.undoStack.length === 0 || !state.currentGraph) return null;
    
    const previousGraph = state.undoStack[state.undoStack.length - 1];
    const newUndoStack = state.undoStack.slice(0, -1);
    
    set({
      undoStack: newUndoStack,
      redoStack: [...state.redoStack, state.currentGraph],
      currentGraph: previousGraph,
    });
    
    return previousGraph;
  },
  
  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return null;
    
    const nextGraph = state.redoStack[state.redoStack.length - 1];
    const newRedoStack = state.redoStack.slice(0, -1);
    
    if (state.currentGraph) {
      set({
        undoStack: [...state.undoStack, state.currentGraph],
        redoStack: newRedoStack,
        currentGraph: nextGraph,
      });
    }
    
    return nextGraph;
  },
  
  clearHistory: () => set({
    undoStack: [],
    redoStack: [],
  }),
  
  // Edge drawing actions
  setEdgeDrawSource: (nodeId) => set({ edgeDrawSource: nodeId }),
  
  // Helper actions
  getNodeById: (nodeId) => {
    const state = get();
    if (!state.currentGraph) return null;
    return state.currentGraph.nodes.find(node => node.id === nodeId) || null;
  },
  
  getEdgeById: (edgeId) => {
    const state = get();
    if (!state.currentGraph) return null;
    return state.currentGraph.edges.find(edge => edge.id === edgeId) || null;
  },
}));