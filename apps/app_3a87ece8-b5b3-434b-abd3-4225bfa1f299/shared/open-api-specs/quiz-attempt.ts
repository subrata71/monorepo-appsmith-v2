/**
 * Quiz Attempt OpenAPI Specification
 *
 * OpenAPI TypeScript definitions for Quiz Attempt endpoints
 */

// OpenAPI Schema Definitions
export const schemas = {
  QuizAttempt: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the quiz attempt',
      },
      quizId: {
        type: 'string',
        format: 'uuid',
        description: 'The quiz this attempt is for',
      },
      answers: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Answer',
        },
        description: 'List of answers provided in this attempt',
      },
      score: {
        type: 'integer',
        minimum: 0,
        description: 'Score achieved in this attempt',
      },
      completed: {
        type: 'boolean',
        description: 'Whether the quiz attempt is completed',
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
    required: ['id', 'quizId', 'answers', 'score', 'completed', 'createdAt', 'updatedAt'],
  } as const,

  Answer: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the answer',
      },
      questionId: {
        type: 'string',
        format: 'uuid',
        description: 'The question this answer is for',
      },
      selectedOptionId: {
        type: 'string',
        format: 'uuid',
        description: 'The selected answer option',
      },
      isCorrect: {
        type: 'boolean',
        description: 'Whether this answer is correct',
      },
    },
    required: ['id', 'questionId', 'selectedOptionId', 'isCorrect'],
  } as const,

  NewQuizAttempt: {
    type: 'object',
    properties: {
      quizId: {
        type: 'string',
        format: 'uuid',
        description: 'The quiz to start an attempt for',
      },
    },
    required: ['quizId'],
  } as const,

  UpdateQuizAttempt: {
    type: 'object',
    properties: {
      answers: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/NewAnswer',
        },
        description: 'Answers to update',
      },
      completed: {
        type: 'boolean',
        description: 'Whether to mark the attempt as completed',
      },
    },
  } as const,

  NewAnswer: {
    type: 'object',
    properties: {
      questionId: {
        type: 'string',
        format: 'uuid',
        description: 'The question this answer is for',
      },
      selectedOptionId: {
        type: 'string',
        format: 'uuid',
        description: 'The selected answer option',
      },
    },
    required: ['questionId', 'selectedOptionId'],
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/api/quiz-attempts': {
    post: {
      summary: 'Create quiz attempt',
      description: 'Start a new quiz attempt for a user session.',
      operationId: 'createQuizAttempt',
      tags: ['QuizAttempt'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/NewQuizAttempt',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Quiz attempt created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    $ref: '#/components/schemas/QuizAttempt',
                  },
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
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
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
  '/api/quiz-attempts/{id}': {
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'The quiz attempt ID',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
    ],
    put: {
      summary: 'Update quiz attempt',
      description: 'Update a quiz attempt with answers and progress.',
      operationId: 'updateQuizAttempt',
      tags: ['QuizAttempt'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateQuizAttempt',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Quiz attempt updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    $ref: '#/components/schemas/QuizAttempt',
                  },
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
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        404: {
          description: 'Quiz attempt not found',
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