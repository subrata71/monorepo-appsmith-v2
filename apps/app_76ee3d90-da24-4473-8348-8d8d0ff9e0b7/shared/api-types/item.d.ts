/**
 * Item Helper Types
 * 
 * Helper types and utilities specific to Item routes
 * These are derived from the generated OpenAPI types
 */

import type { 
  ResponseSchema,
  RequestBody,
  PathParams,
  ListRoute,
  GetRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute
} from './common.js';

// ============================================================================
// ITEM-SPECIFIC TYPES
// ============================================================================

/** Item data structure */
export interface Item {
  id: string;
  title: string;
  status: 'pending' | 'done';
  createdAt: string;
  updatedAt: string;
}

/** New item creation payload */
export interface NewItem {
  title: string;
  status?: 'pending' | 'done';
}

/** Item update payload */
export interface UpdateItemPayload {
  title?: string;
  status?: 'pending' | 'done';
}

// ============================================================================
// FASTIFY ROUTE TYPE DEFINITIONS
// ============================================================================

/** Fastify route types for Item endpoints */
export namespace ItemRoutes {
  /** GET /items - List all items */
  export interface List {
    Reply: {
      data: Item[];
    };
  }

  /** GET /items/:id - Get item by ID */
  export interface Get {
    Params: {
      id: string;
    };
    Reply: {
      data: Item;
    };
  }

  /** POST /items - Create new item */
  export interface Create {
    Body: NewItem;
    Reply: {
      data: Item;
    };
  }

  /** PUT /items/:id - Update item */
  export interface Update {
    Params: {
      id: string;
    };
    Body: UpdateItemPayload;
    Reply: {
      data: Item;
    };
  }

  /** DELETE /items/:id - Delete item */
  export interface Delete {
    Params: {
      id: string;
    };
  }

  /** POST /items/:id/markDone - Mark item as done (key endpoint for toast functionality) */
  export interface MarkDone {
    Params: {
      id: string;
    };
    Reply: {
      data: Item;
      message: string;
    };
  }
}