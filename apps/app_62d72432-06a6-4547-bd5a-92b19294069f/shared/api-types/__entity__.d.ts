/**
 * __Entity__ Helper Types
 *
 * Helper types and utilities specific to __Entity__ routes
 * These are derived from the generated OpenAPI types
 *
 * ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
 * Copy this file to create new entity helper types (e.g., user.ts)
 * Replace __Entity__ with your entity name and __entityPlural__ with the plural form
 *
 * Note: After creating/updating OpenAPI specs, run: cd shared && pnpm generate-types
 * to regenerate the underlying types that this file depends on.
 */

import type {
  ListRoute,
  GetRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,
} from './common.js';

// ============================================================================
// FASTIFY ROUTE TYPE DEFINITIONS
// ============================================================================

/** Fastify route types for __Entity__ endpoints */
export namespace __Entity__Routes {
  /** GET /__entityPlural__ - List all entities */
  export type List = ListRoute<'/__entityPlural__'>;

  /** GET /__entityPlural__/:id - Get entity by ID */
  export type Get = GetRoute<'/__entityPlural__/{id}'>;

  /** POST /__entityPlural__ - Create new entity */
  export type Create = CreateRoute<'/__entityPlural__'>;

  /** PUT /__entityPlural__/:id - Update entity */
  export type Update = UpdateRoute<'/__entityPlural__/{id}'>;

  /** DELETE /__entityPlural__/:id - Delete entity */
  export type Delete = DeleteRoute<'/__entityPlural__/{id}'>;
}
