/**
 * User Login API Mutations
 *
 * API calls for user authentication using TanStack Query mutations
 */

import { useMutation } from '@tanstack/react-query';
import { post, handleError } from '@/shared/api';
import type { LoginUserRequest, LoginUserResponse } from '@/entities/user';

// Login User Mutation
export const useLoginUser = () =>
  useMutation({
    mutationFn: async (
      loginData: LoginUserRequest
    ): Promise<LoginUserResponse> => {
      const { data, error } = await post('/auth/login', {
        body: loginData,
      });

      if (error) handleError(error);

      return data as LoginUserResponse;
    },
  });
