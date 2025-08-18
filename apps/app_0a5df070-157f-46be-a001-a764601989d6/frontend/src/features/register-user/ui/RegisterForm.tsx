/**
 * User Registration Form Component
 *
 * Handles user registration with real-time validation and error handling
 */

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useRegisterUser } from '../api/mutations';
import type { UserRegistrationRequest, User } from '@/entities/user';

// Validation schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be less than 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: (user: User) => void;
}

export const RegisterForm = React.memo<RegisterFormProps>(({ onSuccess }) => {
  const registerMutation = useRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Real-time validation
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...userData } = data;
        const result = await registerMutation.mutateAsync(
          userData as UserRegistrationRequest
        );

        // Call success callback with user data
        if (onSuccess) {
          onSuccess(result.data.user);
        }

        // Reset form on success
        reset();
      } catch (error) {
        // Error is handled by the mutation
        console.error('Registration failed:', error);
      }
    },
    [registerMutation, onSuccess, reset]
  );

  const isLoading = useMemo(
    () => isSubmitting || registerMutation.isPending,
    [isSubmitting, registerMutation.isPending]
  );

  const errorMessage = useMemo(() => {
    if (registerMutation.error) {
      const error = registerMutation.error as Error & {
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
      return 'Registration failed. Please try again.';
    }
    return null;
  }, [registerMutation.error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

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
          placeholder="Create a secure password"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Password must be at least 8 characters long
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
});
