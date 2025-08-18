/**
 * Common Helper Type Functions
 * 
 * Shared utility types for working with OpenAPI generated types
 * These functions can be used across all entity-specific files
 */

import type { paths, components } from './generated-types.js';

// ============================================================================
// COMMON API TYPES
// ============================================================================

/** Error response structure */
export type ApiErrorResponse = components["schemas"]["ApiErrorResponse"];

/** Union type for all possible API responses (success or error) */
export type ApiResponse<T> = T | ApiErrorResponse;

// ============================================================================
// HELPER TYPE FUNCTIONS FOR ALL ENTITIES
// ============================================================================

/** Helper to extract response schema from a path and method */
export type ResponseSchema<Path extends keyof paths, Method extends string> = 
  paths[Path] extends { [K in Method]: { responses: { 200: { content: { 'application/json': infer Schema } } } } }
    ? Schema
    : paths[Path] extends { [K in Method]: { responses: { 201: { content: { 'application/json': infer Schema } } } } }
    ? Schema
    : never;

/** Helper to extract request body from a path and method */
export type RequestBody<Path extends keyof paths, Method extends string> = 
  paths[Path] extends { [K in Method]: { requestBody: { content: { 'application/json': { schema: infer Schema } } } } }
    ? Schema
    : paths[Path] extends { [K in Method]: { requestBody: { content: { 'application/json': infer Body } } } }
    ? Body
    : never;

/** Helper to extract path parameters */
export type PathParams<Path extends keyof paths> = 
  paths[Path] extends { parameters: { path: infer Params } }
    ? Params
    : never;

// ============================================================================
// COMMON ROUTE TYPE PATTERNS
// ============================================================================

/** Common pattern for list routes */
export type ListRoute<Path extends keyof paths> = {
  Reply: ResponseSchema<Path, 'get'>;
};

/** Common pattern for get by ID routes */
export type GetRoute<Path extends keyof paths> = {
  Params: PathParams<Path>;
  Reply: ResponseSchema<Path, 'get'>;
};

/** Common pattern for create routes */
export type CreateRoute<Path extends keyof paths> = {
  Body: RequestBody<Path, 'post'>;
  Reply: ResponseSchema<Path, 'post'>;
};

/** Common pattern for update routes */
export type UpdateRoute<Path extends keyof paths> = {
  Params: PathParams<Path>;
  Body: RequestBody<Path, 'put'>;
  Reply: ResponseSchema<Path, 'put'>;
};

/** Common pattern for delete routes */
export type DeleteRoute<Path extends keyof paths> = {
  Params: PathParams<Path>;
  Reply: void;
}; 