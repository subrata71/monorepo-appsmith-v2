import { useMemo } from 'react';
import type { Graph, GraphNode, GraphEdge, GraphValidationError } from '@/entities/graph';
import { validateGraphStructure, detectCycles } from '@/shared/lib/graph-parser';

export interface GraphValidationResult {
  isValid: boolean;
  errors: GraphValidationError[];
  hasServerErrors: boolean;
  hasClientErrors: boolean;
  cycleDetected: boolean;
  cyclePath?: string[];
}

/**
 * Hook for comprehensive graph validation combining server and client-side checks
 */
export function useGraphValidation(graph: Graph | null): GraphValidationResult {
  return useMemo(() => {
    if (!graph) {
      return {
        isValid: false,
        errors: [],
        hasServerErrors: false,
        hasClientErrors: false,
        cycleDetected: false,
      };
    }

    // Server-side validation results
    const serverErrors = graph.validationErrors || [];
    const hasServerErrors = serverErrors.length > 0;
    const serverValid = graph.isValid;

    // Client-side validation
    const clientValidation = validateGraphStructure(graph.nodes, graph.edges);
    const hasClientErrors = !clientValidation.isValid;

    // Combine all errors, avoiding duplicates
    const allErrors: GraphValidationError[] = [...serverErrors];
    
    if (hasClientErrors) {
      for (const error of clientValidation.errors) {
        // Only add if not already present
        const isDuplicate = serverErrors.some(serverError => 
          serverError.message === error || 
          serverError.type === 'CYCLE_DETECTED' && error.includes('Cycle detected')
        );
        
        if (!isDuplicate) {
          // Categorize client errors by type
          let errorType: GraphValidationError['type'] = 'INVALID_NODE_REFERENCE';
          if (error.includes('Cycle detected')) {
            errorType = 'CYCLE_DETECTED';
          } else if (error.includes('Self-loop')) {
            errorType = 'SELF_LOOP';
          } else if (error.includes('Duplicate edge')) {
            errorType = 'DUPLICATE_EDGE';
          }
          
          allErrors.push({
            type: errorType,
            message: error,
            details: {}
          });
        }
      }
    }

    // Check for cycles specifically
    const nodeLabels = graph.nodes.map(n => n.label);
    const nodeIdToLabel = new Map(graph.nodes.map(n => [n.id, n.label]));
    const edges = graph.edges.map(edge => ({
      source: nodeIdToLabel.get(edge.sourceId) || edge.sourceId,
      target: nodeIdToLabel.get(edge.targetId) || edge.targetId,
    }));
    
    const cycleResult = detectCycles(nodeLabels, edges);

    return {
      isValid: serverValid && clientValidation.isValid,
      errors: allErrors,
      hasServerErrors,
      hasClientErrors,
      cycleDetected: cycleResult.hasCycle,
      cyclePath: cycleResult.cyclePath,
    };
  }, [graph]);
}

/**
 * Hook for validating potential graph changes before applying them
 */
export function useGraphChangeValidation(
  currentNodes: GraphNode[], 
  currentEdges: GraphEdge[], 
  proposedNodes?: GraphNode[], 
  proposedEdges?: GraphEdge[]
): GraphValidationResult {
  return useMemo(() => {
    const nodes = proposedNodes || currentNodes;
    const edges = proposedEdges || currentEdges;
    
    const validation = validateGraphStructure(nodes, edges);
    
    const nodeLabels = nodes.map(n => n.label);
    const nodeIdToLabel = new Map(nodes.map(n => [n.id, n.label]));
    const edgeData = edges.map(edge => ({
      source: nodeIdToLabel.get(edge.sourceId) || edge.sourceId,
      target: nodeIdToLabel.get(edge.targetId) || edge.targetId,
    }));
    
    const cycleResult = detectCycles(nodeLabels, edgeData);
    
    const errors: GraphValidationError[] = validation.errors.map(error => {
      let errorType: GraphValidationError['type'] = 'INVALID_NODE_REFERENCE';
      if (error.includes('Cycle detected')) {
        errorType = 'CYCLE_DETECTED';
      } else if (error.includes('Self-loop')) {
        errorType = 'SELF_LOOP';
      } else if (error.includes('Duplicate edge')) {
        errorType = 'DUPLICATE_EDGE';
      }
      
      return {
        type: errorType,
        message: error,
        details: {}
      };
    });

    return {
      isValid: validation.isValid,
      errors,
      hasServerErrors: false,
      hasClientErrors: !validation.isValid,
      cycleDetected: cycleResult.hasCycle,
      cyclePath: cycleResult.cyclePath,
    };
  }, [currentNodes, currentEdges, proposedNodes, proposedEdges]);
}