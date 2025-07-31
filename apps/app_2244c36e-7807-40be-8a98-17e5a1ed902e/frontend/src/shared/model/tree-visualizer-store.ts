import { create } from 'zustand';
import type { TraversalStep } from '@/entities/tree';

// State for tree visualization and UI interactions
interface TreeVisualizerState {
  // Input state
  inputValue: string;
  isInputValid: boolean;
  inputError: string | null;
  
  // Animation state
  isAnimating: boolean;
  animationSpeed: number; // in milliseconds
  
  // Traversal state
  currentTraversalType: 'inorder' | 'preorder' | 'postorder' | null;
  traversalSteps: TraversalStep[];
  currentStepIndex: number;
  isTraversalActive: boolean;
  
  // Visual state
  highlightedNodeId: string | null;
  selectedNodeId: string | null;
  
  // Tooltip state
  showTooltip: boolean;
  tooltipNodeId: string | null;
  tooltipPosition: { x: number; y: number } | null;
  
  // Tree layout state
  treeLayout: 'vertical' | 'horizontal';
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

interface TreeVisualizerActions {
  // Input actions
  setInputValue: (value: string) => void;
  setInputValid: (isValid: boolean, error?: string) => void;
  clearInput: () => void;
  
  // Animation actions
  setIsAnimating: (isAnimating: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  
  // Traversal actions
  setTraversalType: (type: 'inorder' | 'preorder' | 'postorder' | null) => void;
  setTraversalSteps: (steps: TraversalStep[]) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
  setIsTraversalActive: (isActive: boolean) => void;
  
  // Visual actions
  setHighlightedNode: (nodeId: string | null) => void;
  setSelectedNode: (nodeId: string | null) => void;
  
  // Tooltip actions
  showNodeTooltip: (nodeId: string, position: { x: number; y: number }) => void;
  hideTooltip: () => void;
  
  // Layout actions
  setTreeLayout: (layout: 'vertical' | 'horizontal') => void;
  setZoomLevel: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  resetView: () => void;
  
  // Reset all state
  resetState: () => void;
}

type TreeVisualizerStore = TreeVisualizerState & TreeVisualizerActions;

const initialState: TreeVisualizerState = {
  // Input state
  inputValue: '',
  isInputValid: true,
  inputError: null,
  
  // Animation state
  isAnimating: false,
  animationSpeed: 500,
  
  // Traversal state
  currentTraversalType: null,
  traversalSteps: [],
  currentStepIndex: -1,
  isTraversalActive: false,
  
  // Visual state
  highlightedNodeId: null,
  selectedNodeId: null,
  
  // Tooltip state
  showTooltip: false,
  tooltipNodeId: null,
  tooltipPosition: null,
  
  // Tree layout state
  treeLayout: 'vertical',
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
};

export const useTreeVisualizerStore = create<TreeVisualizerStore>((set, get) => ({
  ...initialState,
  
  // Input actions
  setInputValue: (value: string) => set({ inputValue: value }),
  
  setInputValid: (isValid: boolean, error?: string) => 
    set({ isInputValid: isValid, inputError: error || null }),
  
  clearInput: () => set({ inputValue: '', isInputValid: true, inputError: null }),
  
  // Animation actions
  setIsAnimating: (isAnimating: boolean) => set({ isAnimating }),
  
  setAnimationSpeed: (speed: number) => set({ animationSpeed: speed }),
  
  // Traversal actions
  setTraversalType: (type: 'inorder' | 'preorder' | 'postorder' | null) => 
    set({ currentTraversalType: type }),
  
  setTraversalSteps: (steps: TraversalStep[]) => 
    set({ traversalSteps: steps, currentStepIndex: -1 }),
  
  setCurrentStepIndex: (index: number) => {
    const { traversalSteps } = get();
    const validIndex = Math.max(-1, Math.min(index, traversalSteps.length - 1));
    const highlightedNodeId = validIndex >= 0 ? traversalSteps[validIndex].nodeId : null;
    
    set({ 
      currentStepIndex: validIndex,
      highlightedNodeId 
    });
  },
  
  nextStep: () => {
    const { currentStepIndex, traversalSteps } = get();
    if (currentStepIndex < traversalSteps.length - 1) {
      get().setCurrentStepIndex(currentStepIndex + 1);
    }
  },
  
  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > -1) {
      get().setCurrentStepIndex(currentStepIndex - 1);
    }
  },
  
  resetTraversal: () => set({
    currentStepIndex: -1,
    highlightedNodeId: null,
    isTraversalActive: false,
  }),
  
  setIsTraversalActive: (isActive: boolean) => set({ isTraversalActive: isActive }),
  
  // Visual actions
  setHighlightedNode: (nodeId: string | null) => set({ highlightedNodeId: nodeId }),
  
  setSelectedNode: (nodeId: string | null) => set({ selectedNodeId: nodeId }),
  
  // Tooltip actions
  showNodeTooltip: (nodeId: string, position: { x: number; y: number }) => 
    set({ 
      showTooltip: true, 
      tooltipNodeId: nodeId, 
      tooltipPosition: position 
    }),
  
  hideTooltip: () => 
    set({ 
      showTooltip: false, 
      tooltipNodeId: null, 
      tooltipPosition: null 
    }),
  
  // Layout actions
  setTreeLayout: (layout: 'vertical' | 'horizontal') => set({ treeLayout: layout }),
  
  setZoomLevel: (zoom: number) => {
    const clampedZoom = Math.max(0.1, Math.min(3, zoom));
    set({ zoomLevel: clampedZoom });
  },
  
  setPanOffset: (offset: { x: number; y: number }) => set({ panOffset: offset }),
  
  resetView: () => set({
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 }
  }),
  
  // Reset all state
  resetState: () => set(initialState),
}));