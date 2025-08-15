import React from 'react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { Graph, GraphValidationError } from '@/entities/graph';
import { useGraphValidation } from '@/shared/hooks/use-graph-validation';

interface GraphValidationPanelProps {
  graph: Graph | null;
}

const getErrorIcon = (errorType: string) => {
  switch (errorType) {
    case 'CYCLE_DETECTED':
      return <AlertCircle className="h-4 w-4" />;
    case 'SELF_LOOP':
      return <AlertTriangle className="h-4 w-4" />;
    case 'DUPLICATE_EDGE':
      return <AlertTriangle className="h-4 w-4" />;
    case 'INVALID_NODE_REFERENCE':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getErrorMessage = (error: GraphValidationError) => {
  const details = error.details || {};
  
  switch (error.type) {
    case 'CYCLE_DETECTED':
      const cyclePath = Array.isArray(details.cyclePath) ? details.cyclePath : [];
      return cyclePath.length > 0 
        ? `Cycle detected: ${cyclePath.join(' → ')}`
        : 'A cycle was detected in the graph';
    
    case 'SELF_LOOP':
      return `Self-loop on node ${details.nodeId || 'unknown'}`;
    
    case 'DUPLICATE_EDGE':
      return `Duplicate edge: ${details.edgeKey || 'unknown'}`;
    
    case 'INVALID_NODE_REFERENCE':
      return `Invalid node reference in edge ${details.edgeId || 'unknown'}`;
    
    default:
      return error.message || 'Unknown validation error';
  }
};

export const GraphValidationPanel = React.memo<GraphValidationPanelProps>(({ graph }) => {
  const validation = useGraphValidation(graph);
  
  if (!graph) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-500">No graph loaded</p>
      </div>
    );
  }

  const { isValid, errors, hasServerErrors, hasClientErrors } = validation;
  const hasErrors = !isValid && errors.length > 0;

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="space-y-3">
        {/* Overall status */}
        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Valid DAG</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Invalid Graph</span>
            </>
          )}
        </div>

        {/* Graph stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nodes:</span>
            <span className="ml-2 font-medium">{graph.nodes.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Edges:</span>
            <span className="ml-2 font-medium">{graph.edges.length}</span>
          </div>
        </div>

        {/* Validation errors */}
        {hasErrors && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive" className="py-2">
                <div className="flex items-start gap-2">
                  {getErrorIcon(error.type)}
                  <AlertDescription className="text-sm">
                    {getErrorMessage(error)}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Show validation source info when there are mixed errors */}
        {hasErrors && hasServerErrors && hasClientErrors && (
          <div className="text-xs text-gray-500 mt-2">
            <p>Some errors detected by server validation, others by client validation</p>
          </div>
        )}

        {/* Adjacency list preview */}
        {graph.adjacencyList && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Adjacency List</h4>
            <div className="bg-white border border-gray-200 rounded p-2">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {graph.adjacencyList || 'Empty graph'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});