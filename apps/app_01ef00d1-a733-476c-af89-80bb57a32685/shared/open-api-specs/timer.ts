/**
 * Timer OpenAPI Specification
 * 
 * Defines the API contract for Pomodoro timer operations.
 * This specification is used to generate TypeScript types for both frontend and backend.
 */

import { OpenAPIV3_1 } from 'openapi-types';

export const timerSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: {
    title: 'Timer API',
    version: '1.0.0',
    description: 'API for Pomodoro timer operations',
  },
  paths: {
    '/api/timer': {
      get: {
        operationId: 'getTimer',
        summary: 'Get current timer state',
        description: 'Returns the current timer state from client memory.',
        tags: ['Timer'],
        responses: {
          '200': {
            description: 'Current timer state',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TimerResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        operationId: 'createTimer',
        summary: 'Initialize timer instance',
        description: 'Creates a new timer with default initialSeconds and idle state.',
        tags: ['Timer'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTimerRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Timer created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TimerResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/timer/{id}': {
      put: {
        operationId: 'updateTimer',
        summary: 'Update timer state',
        description: 'Update timer (e.g., start, pause, tick, reset); idempotent.',
        tags: ['Timer'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Timer ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTimerRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Timer updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TimerResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Timer not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        operationId: 'deleteTimer',
        summary: 'Delete timer instance',
        description: 'Removes timer state (resets to default).',
        tags: ['Timer'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Timer ID',
          },
        ],
        responses: {
          '204': {
            description: 'Timer deleted successfully',
          },
          '404': {
            description: 'Timer not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Timer: {
        type: 'object',
        required: ['id', 'currentSeconds', 'status', 'initialSeconds', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the timer',
          },
          currentSeconds: {
            type: 'integer',
            minimum: 0,
            description: 'Current time remaining in seconds',
          },
          status: {
            type: 'string',
            enum: ['idle', 'running', 'paused'],
            description: 'Current status of the timer',
          },
          initialSeconds: {
            type: 'integer',
            minimum: 1,
            description: 'Initial timer duration in seconds',
            default: 1500, // 25 minutes
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the timer was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the timer was last updated',
          },
        },
      },
      CreateTimerRequest: {
        type: 'object',
        properties: {
          initialSeconds: {
            type: 'integer',
            minimum: 1,
            description: 'Initial timer duration in seconds',
            default: 1500, // 25 minutes
          },
        },
      },
      UpdateTimerRequest: {
        type: 'object',
        required: ['action'],
        properties: {
          action: {
            type: 'string',
            enum: ['start', 'pause', 'reset', 'tick'],
            description: 'Action to perform on the timer',
          },
          currentSeconds: {
            type: 'integer',
            minimum: 0,
            description: 'New current seconds value (for tick action)',
          },
        },
      },
      TimerResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            $ref: '#/components/schemas/Timer',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['message'],
            properties: {
              message: {
                type: 'string',
                description: 'Error message',
              },
              code: {
                type: 'string',
                description: 'Error code',
              },
              details: {
                type: 'object',
                description: 'Additional error details',
              },
            },
          },
        },
      },
    },
  },
};