import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { UserRoutes } from '@app/shared/api-types/user';
import { log } from '../utils/index';

export default async function authRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // 👇 grab the service from app.services (fully typed via your augmentation)
  const svc = app.services.user;

  // User Login endpoint
  app.post(
    '/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const { email, password } = req.body as {
          email: string;
          password: string;
        };

        log.info(`User login attempt for ${email}`);

        const user = await svc.validatePassword(email, password);

        if (!user) {
          log.warn(`Invalid login credentials for ${email}`);
          reply.code(401);
          return {
            error: {
              message: 'Invalid email or password',
              code: 'INVALID_CREDENTIALS',
            },
          };
        }

        reply.code(200);
        return {
          data: {
            user: {
              ...user,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            },
            message: 'Login successful',
          },
        };
      } catch (error) {
        log.error(
          `User login error: ${(error as Error).message} for ${(req.body as any)?.email}`
        );

        reply.code(400);
        return {
          error: {
            message: (error as Error).message || 'Login failed',
            code: 'LOGIN_ERROR',
          },
        };
      }
    }
  );

  // Password Recovery Request endpoint
  app.post(
    '/auth/password-recovery',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const { email } = req.body as { email: string };

        log.info(`Password recovery requested for ${email}`);

        const result = await svc.requestPasswordReset(email);

        reply.code(200);
        return {
          data: {
            message: result.message,
          },
        };
      } catch (error) {
        log.error(
          `Password recovery request error: ${(error as Error).message} for ${(req.body as any)?.email}`
        );

        reply.code(200); // Always return 200 for security
        return {
          data: {
            message:
              'If this email is registered, you will receive password reset instructions.',
          },
        };
      }
    }
  );

  // Password Reset endpoint (using the token)
  app.post(
    '/auth/password-reset',
    {
      schema: {
        body: {
          type: 'object',
          required: ['token', 'newPassword', 'confirmPassword'],
          properties: {
            token: { type: 'string', minLength: 1 },
            newPassword: { type: 'string', minLength: 8 },
            confirmPassword: { type: 'string', minLength: 8 },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const { token, newPassword, confirmPassword } = req.body as {
          token: string;
          newPassword: string;
          confirmPassword: string;
        };

        // Validate passwords match
        if (newPassword !== confirmPassword) {
          reply.code(400);
          return {
            error: {
              message: 'Passwords do not match',
              code: 'PASSWORD_MISMATCH',
            },
          };
        }

        log.info(
          `Password reset attempt with token ${token.substring(0, 8)}...`
        );

        const result = await svc.resetPassword(token, newPassword);

        reply.code(200);
        return {
          data: {
            message: result.message,
          },
        };
      } catch (error) {
        log.error(
          `Password reset error: ${(error as Error).message} for token ${(req.body as any)?.token?.substring(0, 8)}...`
        );

        reply.code(400);
        return {
          error: {
            message: (error as Error).message || 'Password reset failed',
            code: 'PASSWORD_RESET_ERROR',
          },
        };
      }
    }
  );
}
