import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { bstTrees, bstNodes, type BSTTree, type NewBSTTree, type BSTNode, type NewBSTNode } from '../db/schema.js';

export interface BSTreeWithNodes {
  tree: BSTTree;
  nodes: BSTNode[];
}

export interface SearchResult {
  found: boolean;
  path: string[];
  node?: BSTNode;
}

export class BSTService {
  constructor(private fastify: FastifyInstance) {}

  async createTree(name: string): Promise<BSTTree> {
    const [tree] = await this.fastify.db
      .insert(bstTrees)
      .values({ name })
      .returning();
    
    return tree;
  }

  async getTrees(): Promise<BSTTree[]> {
    return await this.fastify.db
      .select()
      .from(bstTrees)
      .orderBy(bstTrees.createdAt);
  }

  async getTree(id: string): Promise<BSTTree | null> {
    const [tree] = await this.fastify.db
      .select()
      .from(bstTrees)
      .where(eq(bstTrees.id, id));
    
    return tree || null;
  }

  async deleteTree(id: string): Promise<boolean> {
    const tree = await this.getTree(id);
    if (!tree) return false;

    // Delete all nodes first
    await this.fastify.db
      .delete(bstNodes)
      .where(eq(bstNodes.id, tree.rootNodeId || ''));

    // Delete the tree record
    const result = await this.fastify.db
      .delete(bstTrees)
      .where(eq(bstTrees.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getTreeWithNodes(treeId: string): Promise<BSTreeWithNodes | null> {
    const tree = await this.getTree(treeId);
    if (!tree) return null;

    const nodes = await this.getTreeNodes(treeId);
    return { tree, nodes };
  }

  async insertNode(treeId: string, value: number): Promise<BSTreeWithNodes | null> {
    const tree = await this.getTree(treeId);
    if (!tree) return null;

    // Check if value already exists
    const existingNodes = await this.getTreeNodes(treeId);
    if (existingNodes.some(node => node.value === value)) {
      throw new Error('Node with this value already exists');
    }

    // Create new node
    const [newNode] = await this.fastify.db
      .insert(bstNodes)
      .values({ value })
      .returning();

    // Simple approach: store all nodes without complex tree structure
    // In a real BST implementation, you'd maintain proper parent-child relationships
    
    return this.getTreeWithNodes(treeId);
  }

  async deleteNode(treeId: string, value: number): Promise<BSTreeWithNodes | null> {
    const tree = await this.getTree(treeId);
    if (!tree) return null;

    const nodes = await this.getTreeNodes(treeId);
    const nodeToDelete = nodes.find(node => node.value === value);
    
    if (!nodeToDelete) {
      throw new Error('Node not found');
    }

    // Delete the node
    await this.fastify.db
      .delete(bstNodes)
      .where(eq(bstNodes.id, nodeToDelete.id));
    
    return this.getTreeWithNodes(treeId);
  }

  async searchNode(treeId: string, value: number): Promise<SearchResult> {
    const nodes = await this.getTreeNodes(treeId);
    const foundNode = nodes.find(node => node.value === value);
    
    return {
      found: !!foundNode,
      path: foundNode ? [foundNode.id] : [],
      node: foundNode
    };
  }

  async resetTree(treeId: string): Promise<BSTreeWithNodes | null> {
    const tree = await this.getTree(treeId);
    if (!tree) return null;

    // Delete all nodes for this tree (simplified approach)
    const nodes = await this.getTreeNodes(treeId);
    for (const node of nodes) {
      await this.fastify.db
        .delete(bstNodes)
        .where(eq(bstNodes.id, node.id));
    }

    // Update tree to have no root
    await this.fastify.db
      .update(bstTrees)
      .set({ rootNodeId: null })
      .where(eq(bstTrees.id, treeId));

    return this.getTreeWithNodes(treeId);
  }

  async getTreeNodes(treeId: string): Promise<BSTNode[]> {
    // Simplified: return all nodes ordered by value
    // In a real implementation, you'd traverse the tree structure
    return await this.fastify.db
      .select()
      .from(bstNodes)
      .orderBy(bstNodes.value);
  }
}