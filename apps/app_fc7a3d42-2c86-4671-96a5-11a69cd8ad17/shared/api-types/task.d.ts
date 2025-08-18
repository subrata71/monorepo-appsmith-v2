/**
 * Task API Helper Types
 *
 * Type utilities for task-related API operations.
 */

import type { paths, components } from './generated-types';

// Extract task-related types from generated OpenAPI types
export type Task = components['schemas']['Task'];
export type TaskCreate = components['schemas']['TaskCreate'];
export type TaskUpdate = components['schemas']['TaskUpdate'];
export type TaskList = components['schemas']['TaskList'];

// Task status enum for better type safety
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// API route types for type-safe route handlers
export namespace TaskRoutes {
  export type List = {
    Querystring: {
      status?: TaskStatus;
      limit?: number;
      offset?: number;
      sortBy?: 'order' | 'createdAt' | 'updatedAt' | 'title';
      sortOrder?: 'asc' | 'desc';
    };
    Reply: {
      data: Task[];
    };
  };

  export type GetById = {
    Params: {
      id: string;
    };
    Reply: {
      data: Task;
    };
  };

  export type Create = {
    Body: TaskCreate;
    Reply: {
      data: Task;
    };
  };

  export type Update = {
    Params: {
      id: string;
    };
    Body: TaskUpdate;
    Reply: {
      data: Task;
    };
  };

  export type Delete = {
    Params: {
      id: string;
    };
    Reply: undefined;
  };
}

// Client-side API response types
export interface TaskApiResponse {
  data: Task;
}

export interface TaskListApiResponse {
  data: Task[];
}

// Query parameter types for client-side usage
export interface TaskListQueryParams {
  status?: TaskStatus;
  limit?: number;
  offset?: number;
  sortBy?: 'order' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Utility types for drag-and-drop operations
export interface TaskMoveOperation {
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  newOrder: number;
}

export interface TaskReorderOperation {
  taskId: string;
  status: TaskStatus;
  newOrder: number;
}