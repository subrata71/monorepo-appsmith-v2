export interface TreeNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tree {
  id: string;
  rootId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TreeStructure {
  tree: Tree | null;
  nodes: TreeNode[];
  traversalSteps?: TraversalStep[];
}

export interface TraversalStep {
  id?: string;
  nodeId: string;
  order: number;
  traversalType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TraversalResult {
  steps: TraversalStep[];
  traversalType: 'inorder' | 'preorder' | 'postorder';
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AddNodeRequest {
  value: number;
}

export interface RemoveNodeRequest {
  value: number;
}

export interface TraversalQuery {
  traversalType: 'inorder' | 'preorder' | 'postorder';
}

// Helper types for tree visualization
export interface TreeNodePosition {
  id: string;
  x: number;
  y: number;
  value: number;
}

export interface TreeVisualizationData {
  nodes: TreeNodePosition[];
  edges: { from: string; to: string }[];
}