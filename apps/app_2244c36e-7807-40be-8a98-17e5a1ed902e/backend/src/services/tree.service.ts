import { FastifyInstance } from 'fastify';
import { TreeNode, TraversalStep } from '../db/schema.js';
import { log } from '../utils/index.js';

export interface TreeWithNodes {
  tree: { id: string; rootId: string | null } | null;
  nodes: TreeNode[];
}

export interface TreeStructure {
  tree: { id: string; rootId: string | null } | null;
  nodes: TreeNode[];
  traversalSteps?: TraversalStep[];
}

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

  // Add a node to the binary tree
  addNode: async (value: number): Promise<TreeStructure> => {
    log.info(`Adding node with value: ${value}`);
    
    // Check if value already exists
    const exists = await app.repositories.tree.valueExists(value);
    if (exists) {
      throw new Error(`Node with value ${value} already exists`);
    }

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
    const rootNode = nodes.find(n => n.id === currentTree.rootId);
    if (!rootNode) {
      throw new Error('Tree structure is corrupted - root node not found');
    }

    let currentNodeId = rootNode.id;
    let parentId: string | null = null;
    let isLeftChild = false;

    // Traverse tree to find insertion point
    while (currentNodeId) {
      const currentNode = nodes.find(n => n.id === currentNodeId);
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
    
    const { tree, nodes } = await app.repositories.tree.getTreeWithNodes();
    
    if (!tree || !tree.rootId) {
      throw new Error('Tree is empty');
    }

    const nodeToRemove = nodes.find(n => n.value === value);
    if (!nodeToRemove) {
      throw new Error(`Node with value ${value} not found`);
    }

    // Handle different cases for node removal
    const leftChild = nodes.find(n => n.id === nodeToRemove.leftId);
    const rightChild = nodes.find(n => n.id === nodeToRemove.rightId);
    const parent = nodeToRemove.parentId ? nodes.find(n => n.id === nodeToRemove.parentId) : null;

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
        successor = nodes.find(n => n.id === successor.leftId)!;
      }
      
      // Replace node's value with successor's value
      await app.repositories.tree.updateNode(nodeToRemove.id, { value: successor.value });
      
      // Remove successor (which has at most one right child)
      if (successor.rightId) {
        const successorRight = nodes.find(n => n.id === successor.rightId)!;
        
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
  getTraversalSteps: async (traversalType: 'inorder' | 'preorder' | 'postorder'): Promise<TraversalStep[]> => {
    log.info(`Generating ${traversalType} traversal steps`);
    
    const { tree, nodes } = await app.repositories.tree.getTreeWithNodes();
    
    if (!tree || !tree.rootId) {
      return [];
    }

    // Clear existing traversal steps for this type
    await app.repositories.tree.deleteTraversalSteps(traversalType);
    
    const steps: TraversalStep[] = [];
    let order = 0;

    const traverse = (nodeId: string | null) => {
      if (!nodeId) return;
      
      const node = nodes.find(n => n.id === nodeId);
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
});