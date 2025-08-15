export interface VisualizationState {
  array: number[];
  originalArray: number[];
  arraySize: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentStep: number;
  highlightedIndices: number[];
  sortedPartition: number;
  animationSpeed: number;
  error: string | null;
}

export interface ArrayValidationResult {
  valid: boolean;
  array?: number[];
  error?: string;
}