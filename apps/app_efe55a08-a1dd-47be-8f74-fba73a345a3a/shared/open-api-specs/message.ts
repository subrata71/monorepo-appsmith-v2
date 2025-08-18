/**
 * OpenAPI specification for Message entity
 * Defines the API contract for chat messages
 */

export const messageSpecs = {
  '/messages': {
    get: {
      summary: 'List messages',
      description: 'Retrieve a chronological, paginated list of chat messages.',
      operationId: 'getMessages',
      tags: ['chat'],
      parameters: [
        {
          name: 'before',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            description: 'Cursor for pagination - messages before this ID'
          }
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            default: 50,
            minimum: 1,
            maximum: 100,
            description: 'Maximum number of messages to return'
          }
        }
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessagesList'
              }
            }
          }
        },
        400: {
          description: 'Validation Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    post: {
      summary: 'Send message',
      description: 'Send a chat message as the authenticated user.',
      operationId: 'createMessage',
      tags: ['chat'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MessageCreate'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    $ref: '#/components/schemas/Message'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Validation Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Message: {
        type: 'object',
        required: ['id', 'senderId', 'content', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the message'
          },
          senderId: {
            type: 'string',
            description: 'ID of the user who sent the message'
          },
          content: {
            type: 'string',
            description: 'The message content'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the message was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the message was last updated'
          }
        }
      },
      MessageCreate: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
            description: 'The message content to send'
          }
        }
      },
      MessagesList: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Message'
            }
          },
          cursor: {
            type: 'string',
            nullable: true,
            description: 'Cursor for pagination to get next page'
          },
          hasMore: {
            type: 'boolean',
            description: 'Whether there are more messages to load'
          }
        }
      },
      Error: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            description: 'Error message'
          },
          code: {
            type: 'string',
            description: 'Error code'
          }
        }
      }
    }
  }
} as const;