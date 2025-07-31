import { FastifyInstance } from 'fastify';
import { TreeNode, TraversalStep, TreeSnapshot } from '../db/schema.js';
import { log } from '../utils/index.js';

export interface TreeWithNodes {
  tree: { id: string; rootId: string | null } | null;
  nodes: TreeNode[];
}

export interface TreeStructure {
  tree: { id: string; rootId: string | null } | null;
  nodes: TreeNode[];
  traversalSteps?: TraversalStep[];
  snapshots?: TreeSnapshot[];
  currentSnapshotIndex?: number;
}

// In-memory snapshot stack for undo/redo (simple implementation)
let undoStack: TreeStructure[] = [];
let redoStack: TreeStructure[] = [];
const MAX_SNAPSHOTS = 20;

export const treeService = (app: FastifyInstance) => ({
  // Get current tree structure with all nodes
  getTree: async (): Promise<TreeStructure> => {
    log.info('Getting tree structure');
    const result = await app.repositories.tree.getTreeWithNodes();
    return {
      tree: result.tree,
      nodes: result.nodes,
    };
  },

  // Helper to create a snapshot before modification
  createSnapshot: async (operation: string): Promise<void> => {
    const currentState = await app.repositories.tree.getTreeWithNodes();
    const snapshot: TreeStructure = {
      tree: currentState.tree,
      nodes: [...currentState.nodes], // Deep copy
    };
    
    undoStack.push(snapshot);
    
    // Limit stack size
    if (undoStack.length > MAX_SNAPSHOTS) {
      undoStack.shift();
    }
    
    // Clear redo stack when new operation is performed
    redoStack = [];
    
    log.info(`Created snapshot for operation: ${operation}`);
  },

  // Add a node to the binary tree
  addNode: async (value: number): Promise<TreeStructure> => {
    log.info(`Adding node with value: ${value}`);
    
    // Check if value already exists
    const exists = await app.repositories.tree.valueExists(value);
    if (exists) {
      throw new Error(`Node with value ${value} already exists`);
    }

    // Create snapshot before modification
    await app.services.tree.createSnapshot('add');

    // Get current tree structure
    const { tree, nodes } = await app.repositories.tree.getTreeWithNodes();
    
    // If no tree exists, create one
    let currentTree = tree;
    if (!currentTree) {
      currentTree = await app.repositories.tree.createTree({ rootId: null });
    }

    // If tree is empty, make this the root node
    if (!currentTree.rootId || nodes.length === 0) {
      const newNode = await app.repositories.tree.createNode({ 
        value, 
        leftId: null, 
        rightId: null, 
        parentId: null 
      });
      
      await app.repositories.tree.updateTree(currentTree.id, { rootId: newNode.id });
      
      return await app.repositories.tree.getTreeWithNodes(currentTree.id);
    }

    // Find position to insert new node using BST logic
    const rootNode = nodes.find((n: TreeNode) => n.id === currentTree.rootId);
    if (!rootNode) {
      throw new Error('Tree structure is corrupted - root node not found');
    }

    let currentNodeId = rootNode.id;
    let parentId: string | null = null;
    let isLeftChild = false;

    // Traverse tree to find insertion point
    while (currentNodeId) {
      const currentNode = nodes.find((n: TreeNode) => n.id === currentNodeId);
      if (!currentNode) break;

      parentId = currentNode.id;

      if (value < currentNode.value) {
        isLeftChild = true;
        currentNodeId = currentNode.leftId;
      } else {
        isLeftChild = false;
        currentNodeId = currentNode.rightId;
      }
    }

    // Create new node
    const newNode = await app.repositories.tree.createNode({
      value,
      leftId: null,
      rightId: null,
      parentId,
    });

    // Link parent to new node
    if (parentId) {
      const updateData = isLeftChild ? { leftId: newNode.id } : { rightId: newNode.id };
      await app.repositories.tree.updateNode(parentId, updateData);
    }

    return await app.repositories.tree.getTreeWithNodes(currentTree.id);
  },

  // Remove a node from the binary tree
  removeNode: async (value: number): Promise<TreeStructure> => {
    log.info(`Removing node with value: ${value}`);
    
    // Create snapshot before modification
    await app.services.tree.createSnapshot('remove');
    
    const { tree, nodes } = await app.repositories.tree.getTreeWithNodes();
    
    if (!tree || !tree.rootId) {
      throw new Error('Tree is empty');
    }

    const nodeToRemove = nodes.find((n: TreeNode) => n.value === value);
    if (!nodeToRemove) {
      throw new Error(`Node with value ${value} not found`);
    }

    // Handle different cases for node removal
    const leftChild = nodes.find((n: TreeNode) => n.id === nodeToRemove.leftId);
    const rightChild = nodes.find((n: TreeNode) => n.id === nodeToRemove.rightId);
    const parent = nodeToRemove.parentId ? nodes.find((n: TreeNode) => n.id === nodeToRemove.parentId) : null;

    // Case 1: Node is a leaf (no children)
    if (!leftChild && !rightChild) {
      await app.repositories.tree.deleteNode(nodeToRemove.id);
      
      // Update parent's reference
      if (parent) {
        const updateData = parent.leftId === nodeToRemove.id 
          ? { leftId: null } 
          : { rightId: null };
        await app.repositories.tree.updateNode(parent.id, updateData);
      } else {
        // Removing root node - tree becomes empty
        await app.repositories.tree.updateTree(tree.id, { rootId: null });
      }
    }
    // Case 2: Node has only one child
    else if (!leftChild || !rightChild) {
      const child = leftChild || rightChild;
      
      if (parent) {
        // Link parent to child
        const updateData = parent.leftId === nodeToRemove.id 
          ? { leftId: child!.id } 
          : { rightId: child!.id };
        await app.repositories.tree.updateNode(parent.id, updateData);
        
        // Update child's parent
        await app.repositories.tree.updateNode(child!.id, { parentId: parent.id });
      } else {
        // Removing root - child becomes new root
        await app.repositories.tree.updateTree(tree.id, { rootId: child!.id });
        await app.repositories.tree.updateNode(child!.id, { parentId: null });
      }
      
      await app.repositories.tree.deleteNode(nodeToRemove.id);
    }
    // Case 3: Node has two children - find inorder successor
    else {
      // Find the inorder successor (smallest node in right subtree)
      let successor = rightChild;
      let successorParent = nodeToRemove;
      
      // Go to leftmost node in right subtree
      while (successor.leftId) {
        successorParent = successor;
        successor = nodes.find((n: TreeNode) => n.id === successor.leftId)!;
      }
      
      // Replace node's value with successor's value
      await app.repositories.tree.updateNode(nodeToRemove.id, { value: successor.value });
      
      // Remove successor (which has at most one right child)
      if (successor.rightId) {
        const successorRight = nodes.find((n: TreeNode) => n.id === successor.rightId)!;
        
        if (successorParent.id === nodeToRemove.id) {
          // Successor is direct right child
          await app.repositories.tree.updateNode(nodeToRemove.id, { rightId: successor.rightId });
        } else {
          // Successor is further down - update its parent's left pointer
          await app.repositories.tree.updateNode(successorParent.id, { leftId: successor.rightId });
        }
        
        await app.repositories.tree.updateNode(successorRight.id, { parentId: successorParent.id });
      } else {
        // Successor has no children
        if (successorParent.id === nodeToRemove.id) {
          await app.repositories.tree.updateNode(nodeToRemove.id, { rightId: null });
        } else {
          await app.repositories.tree.updateNode(successorParent.id, { leftId: null });
        }
      }
      
      await app.repositories.tree.deleteNode(successor.id);
    }

    return await app.repositories.tree.getTreeWithNodes(tree.id);
  },

  // Clear entire tree
  clearTree: async (): Promise<TreeStructure> => {
    log.info('Clearing entire tree');
    
    // Create snapshot before modification
    await app.services.tree.createSnapshot('clear');
    
    const { tree } = await app.repositories.tree.getTreeWithNodes();
    
    // Delete all nodes
    await app.repositories.tree.deleteAllNodes();
    
    // Update tree to have no root
    if (tree) {
      await app.repositories.tree.updateTree(tree.id, { rootId: null });
    }
    
    return await app.repositories.tree.getTreeWithNodes(tree?.id);
  },

  // Generate traversal steps for a given traversal type
  getTraversalSteps: async (traversalType: 'inorder' | 'preorder' | 'postorder'): Promise<Array<{ nodeId: string; order: number; traversalType: string }>> => {
    log.info(`Generating ${traversalType} traversal steps`);
    
    const { tree, nodes } = await app.repositories.tree.getTreeWithNodes();
    
    if (!tree || !tree.rootId) {
      return [];
    }

    // Clear existing traversal steps for this type
    await app.repositories.tree.deleteTraversalSteps(traversalType);
    
    const steps: Array<{ nodeId: string; order: number; traversalType: string }> = [];
    let order = 0;

    const traverse = (nodeId: string | null) => {
      if (!nodeId) return;
      
      const node = nodes.find((n: TreeNode) => n.id === nodeId);
      if (!node) return;

      if (traversalType === 'preorder') {
        steps.push({ nodeId, order: order++, traversalType });
      }
      
      // Traverse left
      if (node.leftId) {
        traverse(node.leftId);
      }
      
      if (traversalType === 'inorder') {
        steps.push({ nodeId, order: order++, traversalType });
      }
      
      // Traverse right
      if (node.rightId) {
        traverse(node.rightId);
      }
      
      if (traversalType === 'postorder') {
        steps.push({ nodeId, order: order++, traversalType });
      }
    };

    traverse(tree.rootId);
    
    // Store traversal steps in database
    for (const step of steps) {
      await app.repositories.tree.createTraversalStep(step);
    }
    
    return steps;
  },

  // Validate node value
  validateNodeValue: (value: any): { isValid: boolean; error?: string } => {
    if (typeof value !== 'number') {
      return { isValid: false, error: 'Value must be a number' };
    }
    
    if (!Number.isInteger(value)) {
      return { isValid: false, error: 'Value must be an integer' };
    }
    
    if (value < -1000000 || value > 1000000) {
      return { isValid: false, error: 'Value must be between -1,000,000 and 1,000,000' };
    }
    
    return { isValid: true };
  },

  // Undo the last operation
  undo: async (): Promise<TreeStructure> => {
    log.info('Undoing last operation');
    
    if (undoStack.length === 0) {
      throw new Error('Nothing to undo');
    }

    // Get current state and add to redo stack
    const currentState = await app.repositories.tree.getTreeWithNodes();
    const currentSnapshot: TreeStructure = {
      tree: currentState.tree,
      nodes: [...currentState.nodes],
    };
    redoStack.push(currentSnapshot);

    // Get previous state from undo stack
    const previousState = undoStack.pop()!;
    
    // Restore previous state
    await app.services.tree.restoreTreeState(previousState);
    
    return await app.repositories.tree.getTreeWithNodes();
  },

  // Redo the last undone operation
  redo: async (): Promise<TreeStructure> => {
    log.info('Redoing last undone operation');
    
    if (redoStack.length === 0) {
      throw new Error('Nothing to redo');
    }

    // Get current state and add back to undo stack
    const currentState = await app.repositories.tree.getTreeWithNodes();
    const currentSnapshot: TreeStructure = {
      tree: currentState.tree,
      nodes: [...currentState.nodes],
    };
    undoStack.push(currentSnapshot);

    // Get next state from redo stack
    const nextState = redoStack.pop()!;
    
    // Restore next state
    await app.services.tree.restoreTreeState(nextState);
    
    return await app.repositories.tree.getTreeWithNodes();
  },

  // Helper to restore tree state from snapshot
  restoreTreeState: async (snapshot: TreeStructure): Promise<void> => {
    log.info('Restoring tree state from snapshot');
    
    // Clear all existing nodes
    await app.repositories.tree.deleteAllNodes();
    
    // If snapshot has no tree or nodes, leave empty
    if (!snapshot.tree || !snapshot.nodes || snapshot.nodes.length === 0) {
      // Update tree to have no root if it exists
      const existingTree = await app.repositories.tree.getTreeWithNodes();
      if (existingTree.tree) {
        await app.repositories.tree.updateTree(existingTree.tree.id, { rootId: null });
      }
      return;
    }

    // Get or create tree
    let tree = snapshot.tree;
    const existingTree = await app.repositories.tree.getTreeWithNodes();
    if (!existingTree.tree) {
      tree = await app.repositories.tree.createTree({ rootId: null });
    } else {
      tree = existingTree.tree;
    }

    // Recreate all nodes with their original IDs and relationships
    const nodeMap = new Map<string, string>(); // old ID -> new ID
    
    // First pass: create all nodes without relationships
    for (const node of snapshot.nodes) {
      const newNode = await app.repositories.tree.createNode({
        value: node.value,
        leftId: null,
        rightId: null,
        parentId: null,
      });
      nodeMap.set(node.id, newNode.id);
    }

    // Second pass: establish relationships
    for (const node of snapshot.nodes) {
      const newNodeId = nodeMap.get(node.id)!;
      const updateData: any = {};
      
      if (node.leftId && nodeMap.has(node.leftId)) {
        updateData.leftId = nodeMap.get(node.leftId);
      }
      if (node.rightId && nodeMap.has(node.rightId)) {
        updateData.rightId = nodeMap.get(node.rightId);
      }
      if (node.parentId && nodeMap.has(node.parentId)) {
        updateData.parentId = nodeMap.get(node.parentId);
      }
      
      if (Object.keys(updateData).length > 0) {
        await app.repositories.tree.updateNode(newNodeId, updateData);
      }
    }

    // Set root node
    if (snapshot.tree.rootId && nodeMap.has(snapshot.tree.rootId)) {
      const newRootId = nodeMap.get(snapshot.tree.rootId)!;
      await app.repositories.tree.updateTree(tree.id, { rootId: newRootId });
    }
  },

  // Get undo/redo status
  getUndoRedoStatus: (): { canUndo: boolean; canRedo: boolean } => {
    return {
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
    };
  },
});