/**
 * Note Entity OpenAPI Specification
 *
 * Defines the API contract for note-related operations including
 * listing, creating, retrieving, updating and deleting notes.
 */

import type { OpenAPIV3_1 } from 'openapi-types';

export const noteOpenAPISpec: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: {
    title: 'Note API',
    version: '1.0.0',
    description: 'API for managing notes',
  },
  paths: {
    '/api/notes': {
      get: {
        summary: 'List all notes, most recent first',
        description:
          'Returns paginated, ordered list of notes (public, no auth)',
        operationId: 'getNotes',
        tags: ['note'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Maximum number of notes to return',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            description: 'Number of notes to skip',
            schema: {
              type: 'integer',
              minimum: 0,
              default: 0,
            },
          },
          {
            name: 'sortBy',
            in: 'query',
            required: false,
            description: 'Field to sort by',
            schema: {
              type: 'string',
              enum: ['createdAt', 'updatedAt', 'title'],
              default: 'createdAt',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            required: false,
            description: 'Sort order',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of notes retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Note',
                      },
                    },
                    total: {
                      type: 'integer',
                      description: 'Total number of notes',
                    },
                  },
                  required: ['data', 'total'],
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new note',
        description: 'Create a new note entry',
        operationId: 'createNote',
        tags: ['note'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewNote',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Note created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/Note',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Bad request - invalid data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/notes/{id}': {
      get: {
        summary: 'Get a single note by id',
        description: 'Fetch one note by uuid',
        operationId: 'getNoteById',
        tags: ['note'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The note ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Note retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/Note',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '404': {
            description: 'Note not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update note',
        description: 'Update an existing note with the provided data',
        operationId: 'updateNote',
        tags: ['note'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The note ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateNote',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Note updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/Note',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Bad request - invalid data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Note not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          '422': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete note',
        description: 'Delete a note by its ID',
        operationId: 'deleteNote',
        tags: ['note'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The note ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Note deleted successfully',
          },
          '404': {
            description: 'Note not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
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
      Note: {
        type: 'object',
        description: 'A note entity',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the note',
          },
          title: {
            type: 'string',
            description: 'The note title',
            minLength: 1,
            maxLength: 200,
          },
          body: {
            anyOf: [{ type: 'string', maxLength: 10000 }, { type: 'null' }],
            description: 'The note content/body',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the note was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the note was last updated',
          },
        },
        required: ['id', 'title', 'createdAt', 'updatedAt'],
      },
      NewNote: {
        type: 'object',
        description: 'Data for creating a new note',
        properties: {
          title: {
            type: 'string',
            description: 'The note title',
            minLength: 1,
            maxLength: 200,
          },
          body: {
            anyOf: [{ type: 'string', maxLength: 10000 }, { type: 'null' }],
            description: 'The note content/body',
          },
        },
        required: ['title'],
      },
      UpdateNote: {
        type: 'object',
        description: 'Data for updating a note',
        properties: {
          title: {
            type: 'string',
            description: 'The note title',
            minLength: 1,
            maxLength: 200,
          },
          body: {
            anyOf: [{ type: 'string', maxLength: 10000 }, { type: 'null' }],
            description: 'The note content/body',
          },
        },
      },
      ApiErrorResponse: {
        type: 'object',
        description: 'Standard error response',
        properties: {
          error: {
            type: 'object',
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
                additionalProperties: true,
              },
            },
            required: ['message'],
          },
        },
        required: ['error'],
      },
      ValidationErrorResponse: {
        type: 'object',
        description: 'Validation error response',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Error message',
              },
              code: {
                type: 'string',
                description: 'Error code',
              },
              fields: {
                type: 'object',
                description: 'Field-specific validation errors',
                additionalProperties: {
                  type: 'string',
                },
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

// Export schemas and paths separately for type generation
export const noteSchemas = noteOpenAPISpec.components?.schemas || {};
export const notePaths = noteOpenAPISpec.paths || {};
