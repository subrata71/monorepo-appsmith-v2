import { userRepo } from '../repositories/user.repo';
import type {
  User,
  NewUser,
  PasswordResetToken,
  NewPasswordResetToken,
} from '../db/schema';
import * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, lt, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { log } from '../utils/index';

export function makeUserService(app: FastifyInstance) {
  const repo =
    app.repositories.user ?? userRepo(app.db as NodePgDatabase<typeof schema>);

  const db = app.db as NodePgDatabase<typeof schema>;
  const SALT_ROUNDS = 12;
  const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1; // Reset tokens expire after 1 hour

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('User not found');
      return found;
    },

    async getByEmail(email: string) {
      const found = await repo.findByEmail(email);
      return found;
    },

    async register(name: string, email: string, password: string) {
      log.info(`Starting user registration for email: ${email}, name: ${name}`);

      // Check if user already exists
      const existingUser = await repo.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const userData: NewUser = {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = await repo.create(userData);
      log.info(
        `User registered successfully - userId: ${user.id}, email: ${user.email}`
      );

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    async validatePassword(email: string, password: string) {
      const user = await repo.findByEmail(email);
      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return null;
      }

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    update: (id: string, changes: Partial<User>) => repo.update(id, changes),

    remove: (id: string) => repo.delete(id),

    async requestPasswordReset(
      email: string
    ): Promise<{ success: boolean; message: string }> {
      log.info(`Password reset requested for email: ${email}`);

      try {
        // Check if user exists
        const user = await repo.findByEmail(email);

        // Always return success for security (don't leak if email exists)
        if (!user) {
          log.info(`Password reset requested for non-existent user: ${email}`);
          return {
            success: true,
            message:
              'If this email is registered, you will receive password reset instructions.',
          };
        }

        // Delete any existing tokens for this user
        await db
          .delete(schema.passwordResetTokens)
          .where(eq(schema.passwordResetTokens.userId, user.id));

        // Generate secure random token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(
          expiresAt.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS
        );

        // Store reset token
        const resetTokenData: NewPasswordResetToken = {
          userId: user.id,
          token,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(schema.passwordResetTokens).values(resetTokenData);

        // TODO: Send email with reset link (for now just log it)
        log.info(
          `Password reset token generated - userId: ${user.id}, email: ${email}, token: ${token.substring(0, 8)}...`
        );

        return {
          success: true,
          message:
            'If this email is registered, you will receive password reset instructions.',
        };
      } catch (error) {
        log.error(
          `Password reset request failed - error: ${(error as Error).message}, email: ${email}`
        );

        // Don't leak errors to prevent information disclosure
        return {
          success: true,
          message:
            'If this email is registered, you will receive password reset instructions.',
        };
      }
    },

    async resetPassword(
      token: string,
      newPassword: string
    ): Promise<{ success: boolean; message: string }> {
      log.info(
        `Password reset attempt with token: ${token.substring(0, 8)}...`
      );

      try {
        // Find valid reset token
        const resetTokens = await db
          .select()
          .from(schema.passwordResetTokens)
          .where(eq(schema.passwordResetTokens.token, token))
          .limit(1);

        const resetToken = resetTokens[0];

        if (!resetToken) {
          log.warn(`Invalid password reset token: ${token.substring(0, 8)}...`);
          throw new Error('Invalid or expired reset token');
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
          log.warn(
            `Expired password reset token: ${token.substring(0, 8)}..., expiresAt: ${resetToken.expiresAt}`
          );

          // Clean up expired token
          await db
            .delete(schema.passwordResetTokens)
            .where(eq(schema.passwordResetTokens.id, resetToken.id));

          throw new Error('Invalid or expired reset token');
        }

        // Get user
        const user = await repo.findById(resetToken.userId);
        if (!user) {
          log.error(
            `User not found for valid reset token - userId: ${resetToken.userId}, token: ${token.substring(0, 8)}...`
          );
          throw new Error('Invalid or expired reset token');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update user password
        await repo.update(user.id, {
          passwordHash,
          updatedAt: new Date(),
        });

        // Delete the used token
        await db
          .delete(schema.passwordResetTokens)
          .where(eq(schema.passwordResetTokens.id, resetToken.id));

        // Clean up any other expired tokens for this user
        await db
          .delete(schema.passwordResetTokens)
          .where(
            and(
              eq(schema.passwordResetTokens.userId, user.id),
              lt(schema.passwordResetTokens.expiresAt, new Date())
            )
          );

        log.info(
          `Password reset successful - userId: ${user.id}, email: ${user.email}`
        );

        return {
          success: true,
          message:
            'Your password has been reset successfully. You can now log in with your new password.',
        };
      } catch (error) {
        log.error(
          `Password reset failed - error: ${(error as Error).message}, token: ${token.substring(0, 8)}...`
        );

        throw error;
      }
    },

    async cleanupExpiredPasswordResetTokens(): Promise<number> {
      try {
        const result = await db
          .delete(schema.passwordResetTokens)
          .where(lt(schema.passwordResetTokens.expiresAt, new Date()));

        const deletedCount = result.rowCount || 0;
        if (deletedCount > 0) {
          log.info(
            `Cleaned up expired password reset tokens - deletedCount: ${deletedCount}`
          );
        }

        return deletedCount;
      } catch (error) {
        log.error(
          `Failed to cleanup expired tokens - error: ${(error as Error).message}`
        );
        throw error;
      }
    },
  };
}
export type UserService = ReturnType<typeof makeUserService>;
