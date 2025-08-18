/**
 * User OpenAPI Specification
 * 
 * OpenAPI TypeScript definitions for User endpoints
 * This file contains the OpenAPI schema and path definitions for user registration
 */

// OpenAPI Schema Definitions
export const schemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique user identifier',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        description: 'User full name',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Account creation timestamp',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
      },
    },
    required: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    additionalProperties: false,
  } as const,

  UserRegistrationRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        description: 'User full name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        description: 'User password (minimum 8 characters)',
      },
    },
    required: ['name', 'email', 'password'],
    additionalProperties: false,
  } as const,

  LoginRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        minLength: 1,
        description: 'User password',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  } as const,

  AuthResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
          message: {
            type: 'string',
            description: 'Success message',
          },
        },
        required: ['user', 'message'],
      },
    },
    required: ['data'],
    additionalProperties: false,
  } as const,

  PasswordRecoveryRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address to send recovery instructions',
      },
    },
    required: ['email'],
    additionalProperties: false,
  } as const,

  PasswordResetRequest: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        minLength: 1,
        description: 'Password reset token received via email',
      },
      newPassword: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        description: 'New password (minimum 8 characters)',
      },
      confirmPassword: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        description: 'Confirm new password (must match newPassword)',
      },
    },
    required: ['token', 'newPassword', 'confirmPassword'],
    additionalProperties: false,
  } as const,

  PasswordRecoveryResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Recovery confirmation message',
          },
        },
        required: ['message'],
      },
    },
    required: ['data'],
    additionalProperties: false,
  } as const,

  PasswordResetSuccess: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Password reset success message',
          },
        },
        required: ['message'],
      },
    },
    required: ['data'],
    additionalProperties: false,
  } as const,
} as const;

// OpenAPI Path Definitions
export const paths = {
  '/users/register': {
    post: {
      tags: ['User', 'public'],
      summary: 'Register new user',
      description: 'Register a new user account with email, password, and name.',
      operationId: 'createUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserRegistrationRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        409: {
          description: 'Email already exists',
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
  '/auth/login': {
    post: {
      tags: ['Auth', 'public'],
      summary: 'User login',
      description: 'Authenticate user and establish session.',
      operationId: 'login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
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
  '/auth/password-recovery': {
    post: {
      tags: ['Auth', 'public'],
      summary: 'Request password reset',
      description: 'Initiate password recovery for given email. Always returns success message for security.',
      operationId: 'requestPasswordReset',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PasswordRecoveryRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password recovery request processed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PasswordRecoveryResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation error',
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
  '/auth/password-reset': {
    post: {
      tags: ['Auth', 'public'],
      summary: 'Reset password via token',
      description: 'Reset password using a valid reset token received via email.',
      operationId: 'resetPassword',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PasswordResetRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PasswordResetSuccess',
              },
            },
          },
        },
        400: {
          description: 'Invalid token or validation error',
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