import { create } from 'zustand';
import type { BST, AnimationState, StatusType, SearchResult } from './types';
import { BSTAlgorithms } from './bst-algorithms';

interface BSTStore {
  // State
  bst: BST;
  animationState: AnimationState;
  statusMessage: string;
  statusType: StatusType;
  searchPath: string[];
  
  // Actions
  insertNode: (value: number) => void;
  deleteNode: (value: number) => void;
  searchNode: (value: number) => SearchResult;
  resetTree: () => void;
  setStatusMessage: (message: string, type: StatusType) => void;
  setSearchPath: (path: string[]) => void;
  setAnimationState: (state: Partial<AnimationState>) => void;
  clearStatus: () => void;
}

const createEmptyBST = (): BST => {
  const now = new Date();
  return {
    id: Math.random().toString(36).substr(2, 9),
    root: null,
    createdAt: now,
    updatedAt: now,
  };
};

const initialAnimationState: AnimationState = {
  type: 'idle',
  isAnimating: false,
};

export const useBSTStore = create<BSTStore>((set, get) => ({
  // Initial state
  bst: createEmptyBST(),
  animationState: initialAnimationState,
  statusMessage: 'Binary Search Tree Visualizer ready',
  statusType: 'info',
  searchPath: [],

  // Actions
  insertNode: (value: number) => {
    const { bst } = get();
    
    // Check if node already exists
    if (BSTAlgorithms.nodeExists(bst.root, value)) {
      set({
        statusMessage: `Node with value ${value} already exists`,
        statusType: 'error',
      });
      return;
    }

    // Insert the node
    const newRoot = BSTAlgorithms.insert(bst.root, value);
    const updatedBST: BST = {
      ...bst,
      root: newRoot,
      updatedAt: new Date(),
    };

    set({
      bst: updatedBST,
      statusMessage: `Successfully inserted ${value}`,
      statusType: 'success',
      searchPath: [],
      animationState: {
        type: 'insert',
        nodeId: newRoot?.id,
        isAnimating: true,
      },
    });

    // Clear animation after delay
    setTimeout(() => {
      set({ animationState: initialAnimationState });
    }, 1000);
  },

  deleteNode: (value: number) => {
    const { bst } = get();
    
    // Check if node exists
    if (!BSTAlgorithms.nodeExists(bst.root, value)) {
      set({
        statusMessage: `Node with value ${value} not found`,
        statusType: 'error',
      });
      return;
    }

    // Delete the node
    const newRoot = BSTAlgorithms.delete(bst.root, value);
    const updatedBST: BST = {
      ...bst,
      root: newRoot,
      updatedAt: new Date(),
    };

    set({
      bst: updatedBST,
      statusMessage: `Successfully deleted ${value}`,
      statusType: 'success',
      searchPath: [],
      animationState: {
        type: 'delete',
        isAnimating: true,
      },
    });

    // Clear animation after delay
    setTimeout(() => {
      set({ animationState: initialAnimationState });
    }, 1000);
  },

  searchNode: (value: number) => {
    const { bst } = get();
    
    if (bst.root === null) {
      set({
        statusMessage: 'Tree is empty',
        statusType: 'error',
        searchPath: [],
      });
      return { found: false, path: [] };
    }

    const result = BSTAlgorithms.search(bst.root, value);
    
    set({
      searchPath: result.path,
      statusMessage: result.found 
        ? `Found ${value} in the tree` 
        : `${value} not found in the tree`,
      statusType: result.found ? 'success' : 'error',
      animationState: {
        type: 'search',
        nodeId: result.targetNode?.id,
        highlightedPath: result.path,
        isAnimating: true,
      },
    });

    // Clear search animation after delay
    setTimeout(() => {
      set({ 
        animationState: initialAnimationState,
        searchPath: [],
      });
    }, 2000);

    return result;
  },

  resetTree: () => {
    set({
      bst: createEmptyBST(),
      statusMessage: 'Tree has been reset',
      statusType: 'info',
      searchPath: [],
      animationState: initialAnimationState,
    });
  },

  setStatusMessage: (message: string, type: StatusType) => {
    set({ statusMessage: message, statusType: type });
  },

  setSearchPath: (path: string[]) => {
    set({ searchPath: path });
  },

  setAnimationState: (state: Partial<AnimationState>) => {
    set(prevState => ({
      animationState: { ...prevState.animationState, ...state },
    }));
  },

  clearStatus: () => {
    set({ statusMessage: '', statusType: 'info' });
  },
}));