/**
 * Timer API Types
 * 
 * Types for the Pomodoro timer API
 */

// ============================================================================
// TIMER DOMAIN TYPES
// ============================================================================

export interface Timer {
  id: string;
  currentSeconds: number;
  status: 'idle' | 'running' | 'paused';
  initialSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimerRequest {
  initialSeconds?: number;
}

export interface UpdateTimerRequest {
  action: 'start' | 'pause' | 'reset' | 'tick';
  currentSeconds?: number;
}

export interface TimerResponse {
  data: Timer;
}

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: object;
  };
}

// ============================================================================
// TIMER ROUTE TYPES
// ============================================================================

export type GetTimerRoute = {
  Reply: TimerResponse;
};

export type CreateTimerRoute = {
  Body: CreateTimerRequest;
  Reply: TimerResponse;
};

export type UpdateTimerRoute = {
  Params: { id: string };
  Body: UpdateTimerRequest;
  Reply: TimerResponse;
};

export type DeleteTimerRoute = {
  Params: { id: string };
  Reply: void;
};