/**
 * Graph OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for Graph endpoints
 * This file contains the OpenAPI schema and path definitions
 */

// OpenAPI Schema Definitions  
export const schemas = {
  Graph: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
      },
      nodes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GraphNode',
        },
      },
      edges: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GraphEdge',
        },
      },
      adjacencyList: {
        type: 'string',
        description: 'String representation of the graph as adjacency list',
      },
      isValid: {
        type: 'boolean',
        description: 'Whether the graph is a valid DAG',
      },
      validationErrors: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GraphValidationError',
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['id', 'nodes', 'edges', 'adjacencyList', 'isValid', 'validationErrors', 'createdAt', 'updatedAt'],
  } as const,

  GraphNode: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
      },
      label: {
        type: 'string',
        description: 'Auto-generated label (A, B, C, etc.)',
      },
      x: {
        type: 'number',
        description: 'X coordinate on canvas',
      },
      y: {
        type: 'number',
        description: 'Y coordinate on canvas',
      },
    },
    required: ['id', 'label', 'x', 'y'],
  } as const,

  GraphEdge: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
      },
      sourceId: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the source node',
      },
      targetId: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the target node',
      },
    },
    required: ['id', 'sourceId', 'targetId'],
  } as const,

  GraphValidationError: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['CYCLE_DETECTED', 'SELF_LOOP', 'DUPLICATE_EDGE', 'INVALID_NODE_REFERENCE'],
      },
      message: {
        type: 'string',
      },
      details: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['type', 'message'],
  } as const,

  NewGraph: {
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/NewGraphNode',
        },
        default: [],
      },
      edges: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/NewGraphEdge',
        },
        default: [],
      },
      adjacencyList: {
        type: 'string',
        default: '',
      },
    },
  } as const,

  NewGraphNode: {
    type: 'object',
    properties: {
      label: {
        type: 'string',
      },
      x: {
        type: 'number',
      },
      y: {
        type: 'number',
      },
    },
    required: ['label', 'x', 'y'],
  } as const,

  NewGraphEdge: {
    type: 'object',
    properties: {
      sourceId: {
        type: 'string',
        format: 'uuid',
      },
      targetId: {
        type: 'string',
        format: 'uuid',
      },
    },
    required: ['sourceId', 'targetId'],
  } as const,

  GraphUpdateRequest: {
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GraphNode',
        },
      },
      edges: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GraphEdge',
        },
      },
      adjacencyList: {
        type: 'string',
      },
    },
    additionalProperties: false,
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/graphs': {
    post: {
      summary: 'Create a new graph',
      description: 'Creates a new graph from empty or initial state.',
      tags: ['Graph'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/NewGraph' },
          },
        },
      },
      responses: {
        201: {
          description: 'Graph created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Graph' },
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

  '/graphs/{id}': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'The graph ID',
      },
    ],
    get: {
      summary: 'Get current graph',
      description: 'Returns the current graph.',
      tags: ['Graph'],
      responses: {
        200: {
          description: 'Graph retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Graph' },
                },
                required: ['data'],
              },
            },
          },
        },
        404: {
          description: 'Graph not found',
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
      summary: 'Update the graph',
      description: 'Updates the current graph with new nodes/edges or adjacency list. Validation occurs before update.',
      tags: ['Graph'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/GraphUpdateRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Graph updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Graph' },
                },
                required: ['data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request - invalid data or would create cycle',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiErrorResponse' },
            },
          },
        },
        404: {
          description: 'Graph not found',
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
      summary: 'Delete a graph',
      description: 'Deletes a graph by ID.',
      tags: ['Graph'],
      responses: {
        204: {
          description: 'Graph deleted successfully',
        },
        404: {
          description: 'Graph not found',
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