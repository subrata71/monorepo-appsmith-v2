/**
 * __Entity__ OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for __Entity__ endpoints
 * This file contains the OpenAPI schema and path definitions
 *
 * ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
 * Copy this file to create new entity OpenAPI specs (e.g., user.ts)
 * Replace __Entity__ with your entity name and __entityPlural__ with the plural form
 */

// OpenAPI Schema Definitions
export const schemas = {
  __Entity__: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', maxLength: 255 },
      createdAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'name', 'createdAt'],
  } as const,

  New__Entity__: {
    type: 'object',
    properties: {
      name: { type: 'string', maxLength: 255 },
    },
    required: ['name'],
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/__entityPlural__': {
    get: {
      summary: 'List all entities',
      description: 'Retrieve a list of all entities',
      tags: ['__Entity__'],
      responses: {
        200: {
          description: 'List of entities retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/__Entity__' },
                  },
                },
                required: ['data'],
              },
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
      summary: 'Create a new entity',
      description: 'Create a new entity with the provided data',
      tags: ['__Entity__'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/New__Entity__' },
          },
        },
      },
      responses: {
        201: {
          description: 'Entity created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/__Entity__' },
                },
                required: ['data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid data',
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

  '/__entityPlural__/{id}': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'The entity ID',
      },
    ],
    get: {
      summary: 'Get entity by ID',
      description: 'Retrieve a specific entity by its ID',
      tags: ['__Entity__'],
      responses: {
        200: {
          description: 'Entity retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/__Entity__' },
                },
                required: ['data'],
              },
            },
          },
        },
        404: {
          description: 'Entity not found',
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
      summary: 'Update entity',
      description: 'Update an existing entity with the provided data',
      tags: ['__Entity__'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', maxLength: 255 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Entity updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/__Entity__' },
                },
                required: ['data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        404: {
          description: 'Entity not found',
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
    delete: {
      summary: 'Delete entity',
      description: 'Delete an entity by its ID',
      tags: ['__Entity__'],
      responses: {
        204: {
          description: 'Entity deleted successfully',
        },
        404: {
          description: 'Entity not found',
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
