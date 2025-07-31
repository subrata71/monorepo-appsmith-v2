import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { bstTrees, bstNodes, type BSTTree, type NewBSTTree, type BSTNode, type NewBSTNode } from '../db/schema.js';

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
    // First, delete all nodes belonging to this tree
    // This is a simplified approach - in production, you'd want to handle this more carefully
    const tree = await this.getTree(id);
    if (!tree) return false;

    // Delete the tree record
    const result = await this.fastify.db
      .delete(bstTrees)
      .where(eq(bstTrees.id, id))
      .returning();
    
    return result.length > 0;
  }

  async insertNode(treeId: string, value: number): Promise<BSTNode | null> {
    // This is a simplified implementation
    // In a real scenario, you'd need to properly handle BST insertion logic
    // For now, just create a standalone node
    const [node] = await this.fastify.db
      .insert(bstNodes)
      .values({ value })
      .returning();
    
    return node;
  }

  async getTreeNodes(treeId: string): Promise<BSTNode[]> {
    // This would need more complex logic to properly reconstruct the tree
    // For now, return all nodes (simplified)
    return await this.fastify.db
      .select()
      .from(bstNodes)
      .orderBy(bstNodes.value);
  }
}