// Re-export types from shared API types
export type {
  Graph,
  GraphNode,
  GraphEdge,
  GraphValidationError,
  NewGraph,
  NewGraphNode,
  NewGraphEdge,
  GraphUpdateRequest,
  GraphEditorMode,
  GraphEditorState,
  CanvasPosition,
  NodeCreationData,
  EdgeCreationData,
} from '@app/shared/api-types/graph';

// UI-specific types
export interface GraphCanvasProps {
  width: number;
  height: number;
  graph: Graph | null;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  mode: GraphEditorMode;
  onNodeClick: (nodeId: string) => void;
  onNodeAdd: (position: CanvasPosition) => void;
  onEdgeDraw: (sourceId: string, targetId: string) => void;
  onNodeMove: (nodeId: string, position: CanvasPosition) => void;
  onCanvasClick: (position: CanvasPosition) => void;
}

export interface GraphNodeProps {
  node: GraphNode;
  isSelected: boolean;
  onClick: () => void;
  onMove: (position: CanvasPosition) => void;
}

export interface GraphEdgeProps {
  edge: GraphEdge;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  isSelected: boolean;
  onClick: () => void;
}
