/**
 * Password Recovery API Mutations
 *
 * Handles password recovery API operations using React Query
 */

import { useMutation } from '@tanstack/react-query';
import type {
  RequestPasswordRecoveryRequest,
  RequestPasswordRecoveryResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/entities/user';

// API base URL
const API_BASE = '/api';

/**
 * Request password recovery mutation
 */
export const useRequestPasswordRecovery = () => {
  return useMutation<
    RequestPasswordRecoveryResponse,
    Error,
    RequestPasswordRecoveryRequest
  >({
    mutationFn: async (data: RequestPasswordRecoveryRequest) => {
      const response = await fetch(`${API_BASE}/auth/password-recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error?.message || 'Password recovery request failed'
        );
      }

      return response.json();
    },
    retry: false, // Don't retry password recovery requests
  });
};

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await fetch(`${API_BASE}/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Password reset failed');
      }

      return response.json();
    },
    retry: false, // Don't retry password reset requests
  });
};
