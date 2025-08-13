/**
 * OpenAPI specification for MoodEntry operations
 * 
 * This defines the API contract for mood entry CRUD operations.
 * Note: This is a client-side only application, but we define the API contract
 * for consistency and potential future backend integration.
 */

export const moodEntrySpec = {
  paths: {
    '/mood-entries': {
      get: {
        operationId: 'getMoodEntries',
        summary: 'Get all mood entries',
        description: 'Get all mood entries from local storage',
        tags: ['MoodEntry'],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/MoodEntry',
                      },
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
        },
      },
      post: {
        operationId: 'createMoodEntry',
        summary: 'Create mood entry',
        description: 'Create a new mood entry in local storage',
        tags: ['MoodEntry'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateMoodEntryRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Mood entry created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/MoodEntry',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '400': {
            description: 'Invalid input data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/mood-entries/{id}': {
      get: {
        operationId: 'getMoodEntryById',
        summary: 'Get mood entry by ID',
        description: 'Get a single mood entry by ID from local storage',
        tags: ['MoodEntry'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/MoodEntry',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '404': {
            description: 'Mood entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        operationId: 'updateMoodEntry',
        summary: 'Update mood entry',
        description: 'Update an existing mood entry in local storage',
        tags: ['MoodEntry'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateMoodEntryRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Mood entry updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/MoodEntry',
                    },
                  },
                  required: ['data'],
                },
              },
            },
          },
          '404': {
            description: 'Mood entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        operationId: 'deleteMoodEntry',
        summary: 'Delete mood entry',
        description: 'Delete a mood entry from local storage',
        tags: ['MoodEntry'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Mood entry deleted successfully',
          },
          '404': {
            description: 'Mood entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
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
      MoodEntry: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the mood entry',
          },
          mood: {
            type: 'string',
            enum: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'],
            description: 'Selected mood',
          },
          note: {
            type: 'string',
            nullable: true,
            maxLength: 200,
            description: 'Optional note about the mood',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the entry was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the entry was last updated',
          },
        },
        required: ['id', 'mood', 'createdAt', 'updatedAt'],
      },
      CreateMoodEntryRequest: {
        type: 'object',
        properties: {
          mood: {
            type: 'string',
            enum: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'],
            description: 'Selected mood',
          },
          note: {
            type: 'string',
            nullable: true,
            maxLength: 200,
            description: 'Optional note about the mood',
          },
        },
        required: ['mood'],
      },
      UpdateMoodEntryRequest: {
        type: 'object',
        properties: {
          mood: {
            type: 'string',
            enum: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'],
            description: 'Selected mood',
          },
          note: {
            type: 'string',
            nullable: true,
            maxLength: 200,
            description: 'Optional note about the mood',
          },
        },
      },
      Error: {
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
        },
        required: ['message'],
      },
    },
  },
} as const;