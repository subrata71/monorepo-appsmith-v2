import type * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Graph, NewGraph, GraphNode, NewGraphNode, GraphEdge, NewGraphEdge } from '../db/schema';
import { graphs, graphNodes, graphEdges } from '../db/schema';
import { log } from '../utils/index';

export const graphRepo = (db: NodePgDatabase<typeof schema>) => ({
  // Graph operations
  createGraph: async (p: NewGraph) => {
    log.info('Creating new graph');
    const [newGraph] = await db.insert(graphs).values(p).returning();
    return newGraph;
  },

  findGraphById: async (id: string): Promise<Graph | null> => {
    const graph = await db.query.graphs.findFirst({ 
      where: eq(graphs.id, id) 
    });
    return graph || null;
  },

  findAllGraphs: () => db.select().from(graphs),

  updateGraph: async (id: string, updates: Partial<Graph>) => {
    log.info('Updating graph', { graphId: id });
    const [updated] = await db
      .update(graphs)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(graphs.id, id))
      .returning();
    return updated;
  },

  deleteGraph: (id: string) =>
    db.delete(graphs).where(eq(graphs.id, id)),

  // Node operations
  createNode: async (p: NewGraphNode) => {
    log.info('Creating new graph node');
    const [newNode] = await db.insert(graphNodes).values(p).returning();
    return newNode;
  },

  findNodesByGraphId: (graphId: string) =>
    db.select().from(graphNodes).where(eq(graphNodes.graphId, graphId)),

  findNodeById: async (id: string): Promise<GraphNode | null> => {
    const node = await db.query.graphNodes.findFirst({ 
      where: eq(graphNodes.id, id) 
    });
    return node || null;
  },

  updateNode: async (id: string, updates: Partial<GraphNode>) => {
    log.info('Updating graph node', { nodeId: id });
    const [updated] = await db
      .update(graphNodes)
      .set(updates)
      .where(eq(graphNodes.id, id))
      .returning();
    return updated;
  },

  deleteNode: (id: string) =>
    db.delete(graphNodes).where(eq(graphNodes.id, id)),

  deleteNodesByGraphId: (graphId: string) =>
    db.delete(graphNodes).where(eq(graphNodes.graphId, graphId)),

  // Edge operations
  createEdge: async (p: NewGraphEdge) => {
    log.info('Creating new graph edge');
    const [newEdge] = await db.insert(graphEdges).values(p).returning();
    return newEdge;
  },

  findEdgesByGraphId: (graphId: string) =>
    db.select().from(graphEdges).where(eq(graphEdges.graphId, graphId)),

  findEdgeById: async (id: string): Promise<GraphEdge | null> => {
    const edge = await db.query.graphEdges.findFirst({ 
      where: eq(graphEdges.id, id) 
    });
    return edge || null;
  },

  deleteEdge: (id: string) =>
    db.delete(graphEdges).where(eq(graphEdges.id, id)),

  deleteEdgesByGraphId: (graphId: string) =>
    db.delete(graphEdges).where(eq(graphEdges.graphId, graphId)),

  // Full graph with nodes and edges
  findFullGraphById: async (id: string) => {
    const graph = await db.query.graphs.findFirst({ 
      where: eq(graphs.id, id) 
    });
    
    if (!graph) {
      return null;
    }

    const [nodes, edges] = await Promise.all([
      db.select().from(graphNodes).where(eq(graphNodes.graphId, id)),
      db.select().from(graphEdges).where(eq(graphEdges.graphId, id))
    ]);

    return {
      ...graph,
      nodes,
      edges,
    };
  },
});