/**
 * User API Helper Types
 * 
 * These types provide convenient interfaces for User API operations
 * Generated from the OpenAPI specification in open-api-specs/user.ts
 */

import type { paths, components } from './generated-types';

// Extract User types from generated OpenAPI types
export type User = components['schemas']['User'];
export type UserRegistrationRequest = components['schemas']['UserRegistrationRequest'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type AuthResponse = components['schemas']['AuthResponse'];
export type PasswordRecoveryRequest = components['schemas']['PasswordRecoveryRequest'];
export type PasswordResetRequest = components['schemas']['PasswordResetRequest'];
export type PasswordRecoveryResponse = components['schemas']['PasswordRecoveryResponse'];
export type PasswordResetSuccess = components['schemas']['PasswordResetSuccess'];

// Route types for type-safe API calls
export namespace UserRoutes {
  export type Register = {
    '/users/register': {
      post: paths['/users/register']['post'];
    };
  };
  
  export type Login = {
    '/auth/login': {
      post: paths['/auth/login']['post'];
    };
  };
  
  export type PasswordRecovery = {
    '/auth/password-recovery': {
      post: paths['/auth/password-recovery']['post'];
    };
  };
  
  export type PasswordReset = {
    '/auth/password-reset': {
      post: paths['/auth/password-reset']['post'];
    };
  };
}

// Convenient type aliases for API operations
export type CreateUserRequest = UserRegistrationRequest;
export type CreateUserResponse = AuthResponse;
export type LoginUserRequest = LoginRequest;
export type LoginUserResponse = AuthResponse;
export type RequestPasswordRecoveryRequest = PasswordRecoveryRequest;
export type RequestPasswordRecoveryResponse = PasswordRecoveryResponse;
export type ResetPasswordRequest = PasswordResetRequest;
export type ResetPasswordResponse = PasswordResetSuccess;