/**
 * Alarm OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for Alarm endpoints
 * This file contains the OpenAPI schema and path definitions for alarm management
 */

// OpenAPI Schema Definitions
export const schemas = {
  Alarm: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      time: { type: 'string', format: 'time', description: 'Time in HH:MM format (24-hour)' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'userId', 'time', 'createdAt', 'updatedAt'],
  } as const,

  AlarmCreate: {
    type: 'object',
    properties: {
      time: { type: 'string', format: 'time', description: 'Time in HH:MM format (24-hour)' },
    },
    required: ['time'],
  } as const,

  AlarmUpdate: {
    type: 'object',
    properties: {
      time: { type: 'string', format: 'time', description: 'Time in HH:MM format (24-hour)' },
    },
    required: ['time'],
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/alarms': {
    post: {
      summary: 'Create alarm for current user',
      description: 'Create an alarm time for the authenticated user (one per user)',
      operationId: 'createAlarm',
      tags: ['Alarm'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AlarmCreate' },
          },
        },
      },
      responses: {
        201: {
          description: 'Alarm created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Alarm' },
                },
                required: ['data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid time format',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        401: {
          description: 'Unauthorized - user not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        409: {
          description: 'Conflict - user already has an alarm',
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

  '/alarms/my': {
    get: {
      summary: 'Get current user\'s alarm',
      description: 'Get alarm time for the authenticated user',
      operationId: 'getMyAlarm',
      tags: ['Alarm'],
      responses: {
        200: {
          description: 'User alarm retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Alarm' },
                },
                required: ['data'],
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - user not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        404: {
          description: 'No alarm found for user',
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
      summary: 'Update alarm for current user',
      description: 'Update alarm time for the authenticated user',
      operationId: 'updateAlarm',
      tags: ['Alarm'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AlarmUpdate' },
          },
        },
      },
      responses: {
        200: {
          description: 'Alarm updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Alarm' },
                },
                required: ['data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid time format',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        401: {
          description: 'Unauthorized - user not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        404: {
          description: 'No alarm found for user',
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