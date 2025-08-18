/**
 * User Registration API Mutations
 *
 * API calls for user registration using TanStack Query mutations
 */

import { useMutation } from '@tanstack/react-query';
import { post, handleError } from '@/shared/api';
import type {
  UserRegistrationRequest,
  CreateUserResponse,
} from '@/entities/user';

// Register User Mutation
export const useRegisterUser = () =>
  useMutation({
    mutationFn: async (
      userData: UserRegistrationRequest
    ): Promise<CreateUserResponse> => {
      const { data, error } = await post('/users/register', {
        body: userData,
      });

      if (error) handleError(error);

      return data as CreateUserResponse;
    },
  });
