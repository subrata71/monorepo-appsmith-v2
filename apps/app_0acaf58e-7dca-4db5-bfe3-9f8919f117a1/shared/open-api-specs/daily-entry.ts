/**
 * Daily Entry OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for Daily Entry endpoints
 * This file contains the OpenAPI schema and path definitions
 * for the daily one-sentence journal entry feature
 */

// OpenAPI Schema Definitions
export const schemas = {
  DailyEntry: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      entryDate: { type: 'string', format: 'date' },
      sentence: { type: 'string', maxLength: 200 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'userId', 'entryDate', 'sentence', 'createdAt', 'updatedAt'],
  } as const,

  DailyEntryCreateRequest: {
    type: 'object',
    properties: {
      sentence: { type: 'string', maxLength: 200, minLength: 1 },
      entryDate: { type: 'string', format: 'date' },
    },
    required: ['sentence'],
  } as const,

  DailyEntryUpdateRequest: {
    type: 'object',
    properties: {
      sentence: { type: 'string', maxLength: 200, minLength: 1 },
    },
    required: ['sentence'],
  } as const,

  DailyEntryResponse: {
    type: 'object',
    properties: {
      data: { $ref: '#/components/schemas/DailyEntry' },
    },
    required: ['data'],
  } as const,

  DailyEntryListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/DailyEntry' },
      },
    },
    required: ['data'],
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/daily-entry': {
    get: {
      summary: 'Get today\'s daily entry for the authenticated user',
      description: 'Returns the user\'s entry for a specific date (defaults to today if not provided)',
      operationId: 'getDailyEntryByDate',
      tags: ['DailyEntry'],
      parameters: [
        {
          name: 'entryDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date' },
          description: 'The date for which to retrieve the entry (YYYY-MM-DD format). Defaults to today.',
        },
      ],
      responses: {
        200: {
          description: 'Daily entry retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DailyEntryResponse' },
            },
          },
        },
        404: {
          description: 'Entry not found for the specified date',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a daily entry for today',
      description: 'Create a new one-sentence entry for the authenticated user for the given date (default: today). Only one per user per day.',
      operationId: 'createDailyEntry',
      tags: ['DailyEntry'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DailyEntryCreateRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Daily entry created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DailyEntryResponse' },
            },
          },
        },
        400: {
          description: 'Bad request - input failed validation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        409: {
          description: 'Entry already exists for user and date',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
      },
    },
    put: {
      summary: 'Update today\'s daily entry',
      description: 'Update the one-sentence entry for the authenticated user for today. Only allowed before midnight.',
      operationId: 'updateDailyEntry',
      tags: ['DailyEntry'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DailyEntryUpdateRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Daily entry updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DailyEntryResponse' },
            },
          },
        },
        400: {
          description: 'Bad request - input failed validation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        401: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        403: {
          description: 'Action not allowed (too late or not owner)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        404: {
          description: 'Entry not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
      },
    },
  },
} as const;