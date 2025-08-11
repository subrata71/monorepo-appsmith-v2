/**
 * Item OpenAPI Specification
 * 
 * OpenAPI TypeScript definitions for Item endpoints
 * This file contains the OpenAPI schema and path definitions for Item/Todo management
 */

// OpenAPI Schema Definitions
export const schemas = {
  Item: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      title: { type: 'string', maxLength: 255 },
      status: { type: 'string', enum: ['pending', 'done'], default: 'pending' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    },
    required: ['id', 'title', 'status', 'createdAt', 'updatedAt']
  } as const,
  
  NewItem: {
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 255 },
      status: { type: 'string', enum: ['pending', 'done'], default: 'pending' }
    },
    required: ['title']
  } as const
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/items': {
    get: {
      summary: 'List all items',
      description: 'Retrieve a list of all items',
      tags: ['Item'],
      operationId: 'getItems',
      responses: {
        200: {
          description: 'List of items retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Item' }
                  }
                },
                required: ['data']
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    },
    post: {
      summary: 'Create a new item',
      description: 'Create a new item with the provided data',
      tags: ['Item'],
      operationId: 'createItem',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/NewItem' }
          }
        }
      },
      responses: {
        201: {
          description: 'Item created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Item' }
                },
                required: ['data']
              }
            }
          }
        },
        400: {
          description: 'Bad request - invalid data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    }
  },
  
  '/items/{id}': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'The item ID'
      }
    ],
    get: {
      summary: 'Get item by ID',
      description: 'Retrieve a specific item by its ID',
      tags: ['Item'],
      operationId: 'getItem',
      responses: {
        200: {
          description: 'Item retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Item' }
                },
                required: ['data']
              }
            }
          }
        },
        404: {
          description: 'Item not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      summary: 'Update item',
      description: 'Update an existing item with the provided data',
      tags: ['Item'],
      operationId: 'updateItem',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string', maxLength: 255 },
                status: { type: 'string', enum: ['pending', 'done'] }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Item updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Item' }
                },
                required: ['data']
              }
            }
          }
        },
        400: {
          description: 'Bad request - invalid data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        404: {
          description: 'Item not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete item',
      description: 'Delete an item by its ID',
      tags: ['Item'],
      operationId: 'deleteItem',
      responses: {
        204: {
          description: 'Item deleted successfully'
        },
        404: {
          description: 'Item not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    }
  },

  '/items/{id}/markDone': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'The item ID'
      }
    ],
    post: {
      summary: 'Mark an item as done',
      description: 'Updates the status of an item to "done" - this is the key operation for triggering toast notifications',
      tags: ['Item'],
      operationId: 'markItemDone',
      responses: {
        200: {
          description: 'Item marked as done successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Item' },
                  message: { type: 'string' }
                },
                required: ['data', 'message']
              }
            }
          }
        },
        404: {
          description: 'Item not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' }
            }
          }
        }
      }
    }
  }
} as const;