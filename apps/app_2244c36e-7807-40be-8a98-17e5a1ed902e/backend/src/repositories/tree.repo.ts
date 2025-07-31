import * as schema from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { trees, treeNodes, traversalSteps, Tree, NewTree, TreeNode, NewTreeNode, TraversalStep, NewTraversalStep } from '../db/schema.js';
import { log } from '../utils/index.js';

export const treeRepo = (db: NodePgDatabase<typeof schema>) => ({
  // Tree operations
  createTree: (t: Omit<NewTree, 'id' | 'createdAt' | 'updatedAt'>) =>
    db
      .insert(trees)
      .values(t)
      .returning()
      .then(r => r[0]),

  findTreeById: (id: string) =>
    db.query.trees.findFirst({ where: eq(trees.id, id) }),

  updateTree: async (id: string, updates: Partial<Tree>) => {
    log.info('Updating tree');
    const [updated] = await db
      .update(trees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trees.id, id))
      .returning();
    return updated;
  },

  deleteTree: (id: string) =>
    db.delete(trees).where(eq(trees.id, id)),

  // Tree Node operations
  createNode: (node: Omit<NewTreeNode, 'id' | 'createdAt' | 'updatedAt'>) =>
    db
      .insert(treeNodes)
      .values(node)
      .returning()
      .then(r => r[0]),

  findNodeById: (id: string) =>
    db.query.treeNodes.findFirst({ where: eq(treeNodes.id, id) }),

  findNodeByValue: (value: number) =>
    db.query.treeNodes.findFirst({ where: eq(treeNodes.value, value) }),

  findAllNodes: () => db.select().from(treeNodes),

  updateNode: async (id: string, updates: Partial<TreeNode>) => {
    log.info('Updating tree node');
    const [updated] = await db
      .update(treeNodes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(treeNodes.id, id))
      .returning();
    return updated;
  },

  deleteNode: (id: string) =>
    db.delete(treeNodes).where(eq(treeNodes.id, id)),

  deleteAllNodes: () =>
    db.delete(treeNodes),

  // Traversal operations
  createTraversalStep: (step: Omit<NewTraversalStep, 'id' | 'createdAt' | 'updatedAt'>) =>
    db
      .insert(traversalSteps)
      .values(step)
      .returning()
      .then(r => r[0]),

  findTraversalSteps: (traversalType: string) =>
    db.select().from(traversalSteps).where(eq(traversalSteps.traversalType, traversalType)),

  deleteTraversalSteps: (traversalType?: string) => {
    if (traversalType) {
      return db.delete(traversalSteps).where(eq(traversalSteps.traversalType, traversalType));
    }
    return db.delete(traversalSteps);
  },

  // Complex queries for tree structure
  getTreeWithNodes: async (treeId?: string) => {
    const tree = treeId 
      ? await db.query.trees.findFirst({ where: eq(trees.id, treeId) })
      : await db.query.trees.findFirst(); // Get first tree if no ID specified

    const nodes = await db.select().from(treeNodes);
    
    return {
      tree: tree || null,
      nodes: nodes || []
    };
  },

  // Check if a value already exists in the tree
  valueExists: async (value: number): Promise<boolean> => {
    const existingNode = await db.query.treeNodes.findFirst({ 
      where: eq(treeNodes.value, value) 
    });
    return !!existingNode;
  }
});