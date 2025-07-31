export interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BST {
  id: string;
  root: BSTNode | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NodePosition {
  x: number;
  y: number;
  node: BSTNode;
}

export interface SearchResult {
  found: boolean;
  path: string[];
  targetNode?: BSTNode;
}

export interface AnimationState {
  type: 'insert' | 'delete' | 'search' | 'idle';
  nodeId?: string;
  highlightedPath?: string[];
  isAnimating: boolean;
}

export type StatusType = 'info' | 'success' | 'error';