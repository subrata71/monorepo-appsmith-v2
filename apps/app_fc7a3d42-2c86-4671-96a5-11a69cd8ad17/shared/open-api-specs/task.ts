import type { OpenAPIV3_1 } from 'openapi-types';

/**
 * Task Entity OpenAPI Specification
 *
 * Defines the API contract for task operations including
 * status management and order tracking for kanban boards.
 */
export const taskSpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: {
    title: 'Task API',
    version: '1.0.0',
    description: 'API for managing tasks with status and order tracking',
  },
  paths: {
    '/tasks': {
      get: {
        summary: 'List all tasks',
        description: 'Fetches tasks; supports filtering by status and sorting/reordering.',
        operationId: 'getTasks',
        tags: ['task'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['todo', 'in-progress', 'done'],
            },
            description: 'Filter tasks by status',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
            },
            description: 'Maximum number of tasks to return',
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              minimum: 0,
              default: 0,
            },
            description: 'Number of tasks to skip',
          },
          {
            name: 'sortBy',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['order', 'createdAt', 'updatedAt', 'title'],
              default: 'order',
            },
            description: 'Field to sort by',
          },
          {
            name: 'sortOrder',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
            description: 'Sort order',
          },
        ],
        responses: {
          '200': {
            description: 'List of tasks retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '500': {
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
        summary: 'Create a new task',
        description: 'Creates a new task.',
        operationId: 'createTask',
        tags: ['task'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Task created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Task' },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '500': {
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
    '/tasks/{id}': {
      get: {
        summary: 'Get a single task by ID',
        description: 'Fetches a single task by ID.',
        operationId: 'getTaskById',
        tags: ['task'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'The task ID',
          },
        ],
        responses: {
          '200': {
            description: 'Task retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Task' },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFound' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update a task (used for drag-and-drop status/order changes)',
        description: 'Updates a task (status/order change). Used for drag-and-drop.',
        operationId: 'updateTask',
        tags: ['task'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'The task ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskUpdate' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Task' },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFound' },
              },
            },
          },
          '409': {
            description: 'Conflict - concurrent update detected',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Conflict' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a task',
        description: 'Deletes a task.',
        operationId: 'deleteTask',
        tags: ['task'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'The task ID',
          },
        ],
        responses: {
          '204': {
            description: 'Task deleted successfully',
          },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFound' },
              },
            },
          },
          '500': {
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
  },
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the task',
          },
          title: {
            type: 'string',
            description: 'Task title',
            minLength: 1,
            maxLength: 200,
          },
          description: {
            type: 'string',
            description: 'Task description',
            maxLength: 1000,
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['todo', 'in-progress', 'done'],
            description: 'Current status of the task',
          },
          order: {
            type: 'number',
            description: 'Order position within status column',
            minimum: 0,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Task creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Task last update timestamp',
          },
        },
        required: ['id', 'title', 'status', 'order', 'createdAt', 'updatedAt'],
      },
      TaskCreate: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Task title',
            minLength: 1,
            maxLength: 200,
          },
          description: {
            type: 'string',
            description: 'Task description',
            maxLength: 1000,
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['todo', 'in-progress', 'done'],
            description: 'Initial status of the task',
            default: 'todo',
          },
          order: {
            type: 'number',
            description: 'Order position within status column',
            minimum: 0,
            nullable: true,
          },
        },
        required: ['title'],
      },
      TaskUpdate: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Task title',
            minLength: 1,
            maxLength: 200,
            nullable: true,
          },
          description: {
            type: 'string',
            description: 'Task description',
            maxLength: 1000,
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['todo', 'in-progress', 'done'],
            description: 'New status of the task',
            nullable: true,
          },
          order: {
            type: 'number',
            description: 'New order position within status column',
            minimum: 0,
            nullable: true,
          },
        },
      },
      TaskList: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Task' },
          },
        },
        required: ['data'],
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Human-readable error message',
              },
              code: {
                type: 'string',
                description: 'Machine-readable error code',
              },
              details: {
                type: 'object',
                description: 'Additional error details',
                additionalProperties: true,
              },
            },
            required: ['message'],
          },
        },
        required: ['error'],
      },
      Unauthorized: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Authentication required',
              },
              code: {
                type: 'string',
                default: 'UNAUTHORIZED',
              },
            },
            required: ['message', 'code'],
          },
        },
        required: ['error'],
      },
      Forbidden: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Access forbidden',
              },
              code: {
                type: 'string',
                default: 'FORBIDDEN',
              },
            },
            required: ['message', 'code'],
          },
        },
        required: ['error'],
      },
      NotFound: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Resource not found',
              },
              code: {
                type: 'string',
                default: 'NOT_FOUND',
              },
            },
            required: ['message', 'code'],
          },
        },
        required: ['error'],
      },
      Conflict: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Resource conflict',
              },
              code: {
                type: 'string',
                default: 'CONFLICT',
              },
            },
            required: ['message', 'code'],
          },
        },
        required: ['error'],
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Human-readable error message',
              },
              code: {
                type: 'string',
                description: 'Machine-readable error code',
              },
              details: {
                type: 'object',
                description: 'Additional error details',
                additionalProperties: true,
              },
            },
            required: ['message'],
          },
        },
        required: ['error'],
      },
    },
  },
};