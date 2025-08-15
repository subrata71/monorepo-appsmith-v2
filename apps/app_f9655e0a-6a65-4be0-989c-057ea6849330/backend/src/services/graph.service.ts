import { graphRepo } from '../repositories/graph.repo';
import type { Graph, NewGraph, GraphNode, NewGraphNode, GraphEdge, NewGraphEdge } from '../db/schema';
import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { log } from '../utils/index';

// Types for validation
interface GraphValidationError {
  type: 'CYCLE_DETECTED' | 'SELF_LOOP' | 'DUPLICATE_EDGE' | 'INVALID_NODE_REFERENCE';
  message: string;
  details?: Record<string, unknown>;
}

interface GraphWithNodes extends Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Helper function to detect cycles using DFS
function hasCycle(nodes: GraphNode[], edges: GraphEdge[]): { hasCycle: boolean; cyclePath?: string[] } {
  const adjList = new Map<string, string[]>();
  
  // Build adjacency list
  for (const node of nodes) {
    adjList.set(node.id, []);
  }
  
  for (const edge of edges) {
    const sourceList = adjList.get(edge.sourceId);
    if (sourceList) {
      sourceList.push(edge.targetId);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  
  function dfs(nodeId: string, path: string[]): { hasCycle: boolean; cyclePath?: string[] } {
    if (visiting.has(nodeId)) {
      // Found cycle - return the cycle path
      const cycleStart = path.indexOf(nodeId);
      return { hasCycle: true, cyclePath: path.slice(cycleStart).concat(nodeId) };
    }
    
    if (visited.has(nodeId)) {
      return { hasCycle: false };
    }
    
    visiting.add(nodeId);
    const currentPath = [...path, nodeId];
    
    const neighbors = adjList.get(nodeId) || [];
    for (const neighborId of neighbors) {
      const result = dfs(neighborId, currentPath);
      if (result.hasCycle) {
        return result;
      }
    }
    
    visiting.delete(nodeId);
    visited.add(nodeId);
    
    return { hasCycle: false };
  }
  
  // Check for cycles starting from each unvisited node
  for (const nodeId of adjList.keys()) {
    if (!visited.has(nodeId)) {
      const result = dfs(nodeId, []);
      if (result.hasCycle) {
        return result;
      }
    }
  }
  
  return { hasCycle: false };
}

// Validation function
function validateGraph(nodes: GraphNode[], edges: GraphEdge[]): {
  isValid: boolean;
  errors: GraphValidationError[];
} {
  const errors: GraphValidationError[] = [];
  const nodeIds = new Set(nodes.map(n => n.id));
  
  // Check for invalid node references
  for (const edge of edges) {
    if (!nodeIds.has(edge.sourceId)) {
      errors.push({
        type: 'INVALID_NODE_REFERENCE',
        message: `Source node ${edge.sourceId} does not exist`,
        details: { edgeId: edge.id, sourceId: edge.sourceId }
      });
    }
    if (!nodeIds.has(edge.targetId)) {
      errors.push({
        type: 'INVALID_NODE_REFERENCE',
        message: `Target node ${edge.targetId} does not exist`,
        details: { edgeId: edge.id, targetId: edge.targetId }
      });
    }
  }
  
  // Check for self-loops
  for (const edge of edges) {
    if (edge.sourceId === edge.targetId) {
      errors.push({
        type: 'SELF_LOOP',
        message: `Self-loop detected on node ${edge.sourceId}`,
        details: { edgeId: edge.id, nodeId: edge.sourceId }
      });
    }
  }
  
  // Check for duplicate edges
  const edgeSet = new Set<string>();
  for (const edge of edges) {
    const edgeKey = `${edge.sourceId}->${edge.targetId}`;
    if (edgeSet.has(edgeKey)) {
      errors.push({
        type: 'DUPLICATE_EDGE',
        message: `Duplicate edge from ${edge.sourceId} to ${edge.targetId}`,
        details: { edgeKey }
      });
    }
    edgeSet.add(edgeKey);
  }
  
  // Check for cycles
  if (errors.length === 0) { // Only check cycles if no other errors
    const cycleResult = hasCycle(nodes, edges);
    if (cycleResult.hasCycle) {
      errors.push({
        type: 'CYCLE_DETECTED',
        message: `Cycle detected in graph`,
        details: { cyclePath: cycleResult.cyclePath }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Parse adjacency list text into nodes and edges data
function parseAdjacencyList(text: string): {
  nodes: Array<{ label: string; x: number; y: number }>;
  edges: Array<{ sourceName: string; targetName: string }>;
} {
  const nodeMap = new Map<string, boolean>();
  const edges: Array<{ sourceName: string; targetName: string }> = [];

  if (!text.trim()) {
    return { nodes: [], edges: [] };
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  for (const line of lines) {
    if (!line.includes(':')) continue;

    const [sourceNodeRaw, targetsRaw] = line.split(':', 2);
    const sourceNode = sourceNodeRaw.trim();

    if (!sourceNode || !/^[a-zA-Z0-9_-]+$/.test(sourceNode)) continue;

    nodeMap.set(sourceNode, true);

    const targetsText = targetsRaw.trim();
    if (targetsText) {
      const targets = targetsText.split(',').map(t => t.trim()).filter(t => t);
      
      for (const target of targets) {
        if (!/^[a-zA-Z0-9_-]+$/.test(target)) continue;
        if (target === sourceNode) continue; // Skip self-loops

        nodeMap.set(target, true);
        edges.push({ sourceName: sourceNode, targetName: target });
      }
    }
  }

  // Create nodes with default positions
  const nodes = Array.from(nodeMap.keys()).map((label, index) => ({
    label,
    x: 100 + (index % 5) * 150,
    y: 100 + Math.floor(index / 5) * 100,
  }));

  return { nodes, edges };
}

// Generate adjacency list string representation
function generateAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): string {
  const adjList = new Map<string, string[]>();
  
  // Initialize with all nodes
  for (const node of nodes) {
    adjList.set(node.label, []);
  }
  
  // Add edges
  const nodeLabelMap = new Map(nodes.map(n => [n.id, n.label]));
  for (const edge of edges) {
    const sourceLabel = nodeLabelMap.get(edge.sourceId);
    const targetLabel = nodeLabelMap.get(edge.targetId);
    if (sourceLabel && targetLabel) {
      const list = adjList.get(sourceLabel);
      if (list) {
        list.push(targetLabel);
      }
    }
  }
  
  // Convert to string
  const lines: string[] = [];
  for (const [node, targets] of adjList.entries()) {
    if (targets.length > 0) {
      lines.push(`${node}: ${targets.join(', ')}`);
    } else {
      lines.push(`${node}:`);
    }
  }
  
  return lines.join('\n');
}

// Generate auto labels for nodes (A, B, C, etc.)
function generateNodeLabel(existingLabels: string[]): string {
  const labels = new Set(existingLabels);
  for (let i = 0; i < 26; i++) {
    const label = String.fromCharCode(65 + i); // A-Z
    if (!labels.has(label)) {
      return label;
    }
  }
  // Fallback to numbers if we run out of letters
  let num = 1;
  while (labels.has(`N${num}`)) {
    num++;
  }
  return `N${num}`;
}

export function makeGraphService(app: FastifyInstance) {
  const repo =
    app.repositories.graph ??
    graphRepo(app.db as NodePgDatabase<typeof schema>);

  return {
    async list() {
      const graphs = await repo.findAllGraphs();
      return graphs;
    },

    async get(id: string) {
      const fullGraph = await repo.findFullGraphById(id);
      if (!fullGraph) {
        throw new Error('Graph not found');
      }
      
      return {
        ...fullGraph,
        validationErrors: Array.isArray(fullGraph.validationErrors) 
          ? fullGraph.validationErrors 
          : []
      };
    },

    async create(data: NewGraph) {
      log.info('Creating new graph');
      
      // Create with default empty state
      const graphData = {
        ...data,
        adjacencyList: data.adjacencyList || '',
        isValid: true,
        validationErrors: [],
      };
      
      const newGraph = await repo.createGraph(graphData);
      
      return {
        ...newGraph,
        nodes: [],
        edges: [],
        validationErrors: []
      };
    },

    async update(id: string, updateData: { 
      nodes?: GraphNode[]; 
      edges?: GraphEdge[]; 
      adjacencyList?: string;
    }) {
      const existingGraph = await repo.findFullGraphById(id);
      if (!existingGraph) {
        throw new Error('Graph not found');
      }

      let nodes = updateData.nodes || existingGraph.nodes;
      let edges = updateData.edges || existingGraph.edges;
      let adjacencyList = updateData.adjacencyList;

      // If adjacency list is provided and no explicit nodes/edges, parse it
      if (adjacencyList && !updateData.nodes && !updateData.edges) {
        try {
          const parsed = parseAdjacencyList(adjacencyList);
          
          // Clear existing nodes and edges
          await repo.deleteNodesByGraphId(id);
          await repo.deleteEdgesByGraphId(id);

          // Create new nodes
          const newNodes: GraphNode[] = [];
          for (const nodeData of parsed.nodes) {
            const newNode = await repo.createNode({
              graphId: id,
              label: nodeData.label,
              x: nodeData.x,
              y: nodeData.y,
            });
            newNodes.push(newNode);
          }

          // Create label to ID mapping
          const labelToId = new Map(newNodes.map(n => [n.label, n.id]));

          // Create new edges
          const newEdges: GraphEdge[] = [];
          for (const edgeData of parsed.edges) {
            const sourceId = labelToId.get(edgeData.sourceName);
            const targetId = labelToId.get(edgeData.targetName);

            if (sourceId && targetId) {
              const newEdge = await repo.createEdge({
                graphId: id,
                sourceId,
                targetId,
              });
              newEdges.push(newEdge);
            }
          }

          nodes = newNodes;
          edges = newEdges;
          
        } catch (error) {
          log.error('Error parsing adjacency list:', error);
          throw new Error('Invalid adjacency list format');
        }
      } else {
        // Handle explicit nodes/edges updates
        if (updateData.nodes) {
          await repo.deleteNodesByGraphId(id);
          for (const node of nodes) {
            await repo.createNode({
              ...node,
              graphId: id,
            });
          }
        }

        if (updateData.edges) {
          await repo.deleteEdgesByGraphId(id);
          for (const edge of edges) {
            await repo.createEdge({
              ...edge,
              graphId: id,
            });
          }
        }
      }

      // Validate the updated graph
      const validation = validateGraph(nodes, edges);
      const finalAdjacencyList = adjacencyList || generateAdjacencyList(nodes, edges);

      // Update graph metadata
      const updatedGraph = await repo.updateGraph(id, {
        adjacencyList: finalAdjacencyList,
        isValid: validation.isValid,
        validationErrors: validation.errors,
      });

      return {
        ...updatedGraph,
        nodes,
        edges,
        validationErrors: validation.errors,
      };
    },

    async addNode(graphId: string, nodeData: { x: number; y: number; label?: string }) {
      const existingGraph = await repo.findFullGraphById(graphId);
      if (!existingGraph) {
        throw new Error('Graph not found');
      }

      // Generate label if not provided
      const existingLabels = existingGraph.nodes.map(n => n.label);
      const label = nodeData.label || generateNodeLabel(existingLabels);

      const newNode = await repo.createNode({
        graphId,
        label,
        x: nodeData.x,
        y: nodeData.y,
      });

      // Update adjacency list
      const updatedNodes = [...existingGraph.nodes, newNode];
      const adjacencyList = generateAdjacencyList(updatedNodes, existingGraph.edges);
      
      await repo.updateGraph(graphId, {
        adjacencyList,
      });

      return newNode;
    },

    async addEdge(graphId: string, edgeData: { sourceId: string; targetId: string }) {
      const existingGraph = await repo.findFullGraphById(graphId);
      if (!existingGraph) {
        throw new Error('Graph not found');
      }

      // Check if nodes exist
      const sourceExists = existingGraph.nodes.some(n => n.id === edgeData.sourceId);
      const targetExists = existingGraph.nodes.some(n => n.id === edgeData.targetId);
      
      if (!sourceExists || !targetExists) {
        throw new Error('Source or target node does not exist');
      }

      // Check for self-loop
      if (edgeData.sourceId === edgeData.targetId) {
        throw new Error('Self-loops are not allowed');
      }

      // Check for duplicate edge
      const duplicateExists = existingGraph.edges.some(
        e => e.sourceId === edgeData.sourceId && e.targetId === edgeData.targetId
      );
      if (duplicateExists) {
        throw new Error('Edge already exists');
      }

      // Create temporary edge to test for cycles
      const testEdges = [...existingGraph.edges, {
        id: 'temp',
        graphId,
        sourceId: edgeData.sourceId,
        targetId: edgeData.targetId,
      } as GraphEdge];

      const validation = validateGraph(existingGraph.nodes, testEdges);
      if (!validation.isValid) {
        const cycleError = validation.errors.find(e => e.type === 'CYCLE_DETECTED');
        if (cycleError) {
          throw new Error('Adding this edge would create a cycle');
        }
      }

      // Create the edge
      const newEdge = await repo.createEdge({
        graphId,
        sourceId: edgeData.sourceId,
        targetId: edgeData.targetId,
      });

      // Update graph validation and adjacency list
      const updatedEdges = [...existingGraph.edges, newEdge];
      const adjacencyList = generateAdjacencyList(existingGraph.nodes, updatedEdges);
      const finalValidation = validateGraph(existingGraph.nodes, updatedEdges);

      await repo.updateGraph(graphId, {
        adjacencyList,
        isValid: finalValidation.isValid,
        validationErrors: finalValidation.errors,
      });

      return newEdge;
    },

    async removeNode(graphId: string, nodeId: string) {
      const existingGraph = await repo.findFullGraphById(graphId);
      if (!existingGraph) {
        throw new Error('Graph not found');
      }

      // Remove the node (cascading delete will handle edges)
      await repo.deleteNode(nodeId);

      // Get updated state
      const updatedGraph = await repo.findFullGraphById(graphId);
      if (updatedGraph) {
        const adjacencyList = generateAdjacencyList(updatedGraph.nodes, updatedGraph.edges);
        const validation = validateGraph(updatedGraph.nodes, updatedGraph.edges);

        await repo.updateGraph(graphId, {
          adjacencyList,
          isValid: validation.isValid,
          validationErrors: validation.errors,
        });
      }
    },

    async removeEdge(graphId: string, edgeId: string) {
      const existingGraph = await repo.findFullGraphById(graphId);
      if (!existingGraph) {
        throw new Error('Graph not found');
      }

      await repo.deleteEdge(edgeId);

      // Get updated state
      const updatedGraph = await repo.findFullGraphById(graphId);
      if (updatedGraph) {
        const adjacencyList = generateAdjacencyList(updatedGraph.nodes, updatedGraph.edges);
        const validation = validateGraph(updatedGraph.nodes, updatedGraph.edges);

        await repo.updateGraph(graphId, {
          adjacencyList,
          isValid: validation.isValid,
          validationErrors: validation.errors,
        });
      }
    },

    async remove(id: string) {
      return repo.deleteGraph(id);
    },
  };
}

export type GraphService = ReturnType<typeof makeGraphService>;