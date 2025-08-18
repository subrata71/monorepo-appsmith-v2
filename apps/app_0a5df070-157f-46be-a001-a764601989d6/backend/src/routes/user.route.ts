import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { UserRoutes } from '@app/shared/api-types/user';
import { log } from '../utils/index';

export default async function userRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // 👇 grab the service from app.services (fully typed via your augmentation)
  const svc = app.services.user;

  // User Registration endpoint
  app.post(
    '/users/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, maxLength: 128 },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const { name, email, password } = req.body as {
          name: string;
          email: string;
          password: string;
        };

        log.info(`User registration attempt for ${email} (${name})`);

        const user = await svc.register(name, email, password);

        reply.code(201);
        return {
          data: {
            user: {
              ...user,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            },
            message: 'User registered successfully',
          },
        };
      } catch (error) {
        log.error(
          `User registration error: ${(error as Error).message} for ${(req.body as any)?.email}`
        );

        if (
          (error as Error).message === 'User with this email already exists'
        ) {
          reply.code(409);
          return {
            error: {
              message: 'A user with this email address already exists',
              code: 'EMAIL_ALREADY_EXISTS',
            },
          };
        }

        reply.code(400);
        return {
          error: {
            message: (error as Error).message || 'Registration failed',
            code: 'REGISTRATION_ERROR',
          },
        };
      }
    }
  );
}
