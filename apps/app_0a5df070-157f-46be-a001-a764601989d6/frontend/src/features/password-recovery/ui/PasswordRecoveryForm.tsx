/**
 * Password Recovery Form Component
 *
 * Handles password recovery request with email validation
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useRequestPasswordRecovery } from '../api/mutations';
import type { RequestPasswordRecoveryRequest } from '@/entities/user';

// Validation schema
const passwordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

interface PasswordRecoveryFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const PasswordRecoveryForm = React.memo<PasswordRecoveryFormProps>(
  ({ onSuccess, onBackToLogin }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const recoveryMutation = useRequestPasswordRecovery();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<PasswordRecoveryFormData>({
      resolver: zodResolver(passwordRecoverySchema),
      mode: 'onBlur', // Real-time validation
    });

    const onSubmit = useCallback(
      async (data: PasswordRecoveryFormData) => {
        try {
          await recoveryMutation.mutateAsync(
            data as RequestPasswordRecoveryRequest
          );

          // Mark as submitted to show success message
          setIsSubmitted(true);

          // Call success callback
          if (onSuccess) {
            onSuccess();
          }

          // Reset form
          reset();
        } catch (error) {
          // Error is handled by the mutation
          console.error('Password recovery failed:', error);
        }
      },
      [recoveryMutation, onSuccess, reset]
    );

    const isLoading = useMemo(
      () => isSubmitting || recoveryMutation.isPending,
      [isSubmitting, recoveryMutation.isPending]
    );

    const errorMessage = useMemo(() => {
      if (recoveryMutation.error) {
        const error = recoveryMutation.error as Error & {
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
        return 'Password recovery request failed. Please try again.';
      }
      return null;
    }, [recoveryMutation.error]);

    // If successfully submitted, show confirmation message
    if (isSubmitted) {
      return (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              If your email is registered with us, you will receive password
              reset instructions shortly.
            </AlertDescription>
          </Alert>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBackToLogin}
          >
            Back to Sign In
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          Enter your email address and we'll send you instructions to reset your
          password.
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email Address</Label>
          <Input
            id="recovery-email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
        </Button>

        {/* Back to Login */}
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBackToLogin}
          disabled={isLoading}
        >
          Back to Sign In
        </Button>
      </form>
    );
  }
);
