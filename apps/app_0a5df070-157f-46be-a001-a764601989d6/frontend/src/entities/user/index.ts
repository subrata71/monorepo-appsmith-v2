/**
 * User Entity
 *
 * Domain model for User with types and utilities
 */

export type {
  User,
  UserRegistrationRequest,
  LoginRequest,
  AuthResponse,
  PasswordRecoveryRequest,
  PasswordResetRequest,
  PasswordRecoveryResponse,
  PasswordResetSuccess,
} from '@app/shared/api-types/user';

// Re-export convenience types
export type {
  CreateUserRequest,
  CreateUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  RequestPasswordRecoveryRequest,
  RequestPasswordRecoveryResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@app/shared/api-types/user';
