/**
 * Alarm Helper Types
 *
 * Helper types and utilities specific to Alarm routes
 * These are derived from the generated OpenAPI types
 */

import type {
  GetRoute,
  CreateRoute,
  UpdateRoute,
} from './common';

// ============================================================================
// ALARM DATA TYPES
// ============================================================================

/** Alarm entity type based on OpenAPI schema */
export type Alarm = {
  id: string;
  userId: string;
  time: string;
  createdAt: string;
  updatedAt: string;
};

/** Create alarm request payload */
export type AlarmCreate = {
  time: string;
};

/** Update alarm request payload */
export type AlarmUpdate = {
  time: string;
};

// ============================================================================
// FASTIFY ROUTE TYPE DEFINITIONS
// ============================================================================

/** Fastify route types for Alarm endpoints */
export namespace AlarmRoutes {
  /** GET /alarms/my - Get current user's alarm */
  export type GetMy = {
    Reply: {
      data: Alarm;
    };
  };

  /** POST /alarms - Create alarm for current user */
  export type Create = {
    Body: AlarmCreate;
    Reply: {
      data: Alarm;
    };
  };

  /** PUT /alarms/my - Update current user's alarm */
  export type UpdateMy = {
    Body: AlarmUpdate;
    Reply: {
      data: Alarm;
    };
  };
}

// ============================================================================
// OPENAPI-FETCH CLIENT TYPES
// ============================================================================

/** Type for openapi-fetch client paths related to alarms */
export type AlarmPaths = {
  '/alarms': {
    post: {
      requestBody: {
        content: {
          'application/json': AlarmCreate;
        };
      };
      responses: {
        201: {
          content: {
            'application/json': {
              data: Alarm;
            };
          };
        };
      };
    };
  };
  '/alarms/my': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              data: Alarm;
            };
          };
        };
      };
    };
    put: {
      requestBody: {
        content: {
          'application/json': AlarmUpdate;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              data: Alarm;
            };
          };
        };
      };
    };
  };
};