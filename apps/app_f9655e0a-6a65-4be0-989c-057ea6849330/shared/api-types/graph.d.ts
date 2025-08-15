/**
 * Graph API Helper Types
 * 
 * Helper types for Graph API endpoints to improve developer experience.
 * These complement the auto-generated types in generated-types.d.ts
 */

import type { components } from './generated-types';

// Main entity types
export type Graph = components['schemas']['Graph'];
export type GraphNode = components['schemas']['GraphNode'];
export type GraphEdge = components['schemas']['GraphEdge'];
export type GraphValidationError = components['schemas']['GraphValidationError'];

// Request/Response types
export type NewGraph = components['schemas']['NewGraph'];
export type NewGraphNode = components['schemas']['NewGraphNode'];
export type NewGraphEdge = components['schemas']['NewGraphEdge'];
export type GraphUpdateRequest = components['schemas']['GraphUpdateRequest'];

// API route types for backend (using path parameters)
export namespace GraphRoutes {
  export type Create = {
    Body: NewGraph;
    Reply: { data: Graph };
  };

  export type GetById = {
    Params: { id: string };
    Reply: { data: Graph };
  };

  export type Update = {
    Params: { id: string };
    Body: GraphUpdateRequest;
    Reply: { data: Graph };
  };

  export type Delete = {
    Params: { id: string };
    Reply: void;
  };
}

// Graph validation helpers
export type ValidationErrorType = 'CYCLE_DETECTED' | 'SELF_LOOP' | 'DUPLICATE_EDGE' | 'INVALID_NODE_REFERENCE';

export interface GraphState {
  currentGraph: Graph | null;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  isLoading: boolean;
  error: string | null;
}

// Canvas interaction types
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface NodeCreationData {
  position: CanvasPosition;
  label?: string;
}

export interface EdgeCreationData {
  sourceId: string;
  targetId: string;
}

// UI State types
export interface GraphEditorMode {
  type: 'SELECT' | 'ADD_NODE' | 'DRAW_EDGE' | 'DELETE';
}

export interface GraphEditorState extends GraphState {
  mode: GraphEditorMode;
  undoStack: Graph[];
  redoStack: Graph[];
}