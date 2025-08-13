/**
 * Quiz OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for Quiz endpoints
 */

// OpenAPI Schema Definitions
export const schemas = {
  Quiz: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the quiz',
      },
      title: {
        type: 'string',
        description: 'The title of the quiz',
      },
      instructions: {
        type: 'string',
        nullable: true,
        description: 'Instructions for taking the quiz',
      },
      questions: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Question',
        },
        description: 'List of questions in the quiz',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
      },
    },
    required: ['id', 'title', 'questions', 'createdAt', 'updatedAt'],
  } as const,

  Question: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the question',
      },
      quizId: {
        type: 'string',
        format: 'uuid',
        description: 'The quiz this question belongs to',
      },
      text: {
        type: 'string',
        description: 'The question text',
      },
      options: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Option',
        },
        description: 'List of answer options',
      },
      correctOptionId: {
        type: 'string',
        format: 'uuid',
        description: 'The ID of the correct answer option',
      },
      order: {
        type: 'integer',
        minimum: 1,
        description: 'The order of this question in the quiz',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
      },
    },
    required: ['id', 'quizId', 'text', 'options', 'correctOptionId', 'order', 'createdAt', 'updatedAt'],
  } as const,

  Option: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the option',
      },
      questionId: {
        type: 'string',
        format: 'uuid',
        description: 'The question this option belongs to',
      },
      text: {
        type: 'string',
        description: 'The option text',
      },
    },
    required: ['id', 'questionId', 'text'],
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/api/quizzes/{id}': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'The quiz ID',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    get: {
      summary: 'Get quiz by ID',
      description: 'Get quiz details and questions by quiz ID.',
      operationId: 'getQuizById',
      tags: ['Quiz'],
      responses: {
        200: {
          description: 'Quiz retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    $ref: '#/components/schemas/Quiz',
                  },
                },
                required: ['data'],
              },
            },
          },
        },
        404: {
          description: 'Quiz not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        500: {
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
} as const;