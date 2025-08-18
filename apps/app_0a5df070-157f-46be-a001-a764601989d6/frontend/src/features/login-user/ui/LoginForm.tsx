/**
 * User Login Form Component
 *
 * Handles user authentication with validation and error handling
 */

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useLoginUser } from '../api/mutations';
import type { LoginUserRequest, User } from '@/entities/user';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (user: User) => void;
}

export const LoginForm = React.memo<LoginFormProps>(({ onSuccess }) => {
  const loginMutation = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Real-time validation
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        const result = await loginMutation.mutateAsync(
          data as LoginUserRequest
        );

        // Call success callback with user data
        if (onSuccess) {
          onSuccess(result.data.user);
        }

        // Reset form on success
        reset();
      } catch (error) {
        // Error is handled by the mutation
        console.error('Login failed:', error);
      }
    },
    [loginMutation, onSuccess, reset]
  );

  const isLoading = useMemo(
    () => isSubmitting || loginMutation.isPending,
    [isSubmitting, loginMutation.isPending]
  );

  const errorMessage = useMemo(() => {
    if (loginMutation.error) {
      const error = loginMutation.error as Error & {
        error?: { message?: string };
      };
      // Handle ResponseError from our API
      if (error?.message) {
        return error.message;
      }
      // Handle other error structures
      if (error?.error?.message) {
        return error.error.message;
      }
      return 'Login failed. Please check your credentials and try again.';
    }
    return null;
  }, [loginMutation.error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
});
