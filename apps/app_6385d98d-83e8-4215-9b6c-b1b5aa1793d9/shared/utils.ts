/**
 * API Contract Utilities
 *
 * Utility functions for working with API responses and validation
 * These functions are shared between frontend and backend
 */

import type { ApiErrorResponse, ApiResponse } from './api-types/common';

// ============================================================================
// RESPONSE TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return (
    typeof response === 'object' && response !== null && 'error' in response
  );
}

/**
 * Type guard to check if a response is a success response
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is T {
  return !isErrorResponse(response);
}

/**
 * Extract data from a response, throwing if it's an error
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (isErrorResponse(response)) {
    throw new Error(response.error.message);
  }
  return response;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate entity ID format
 */
export function validateEntityId(id: string): boolean {
  // Basic UUID validation - can be enhanced based on your ID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
