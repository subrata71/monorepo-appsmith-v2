/**
 * Password Reset Page
 *
 * Handles password reset with token from URL
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useResetPassword } from '@/features/password-recovery';
import type { ResetPasswordRequest } from '@/entities/user';

// Validation schema
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetMutation = useResetPassword();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/auth', { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      if (!token) return;

      try {
        const resetData: ResetPasswordRequest = {
          token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        };

        await resetMutation.mutateAsync(resetData);

        // Mark as submitted to show success message
        setIsSubmitted(true);

        // Reset form
        reset();

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      } catch (error) {
        // Error is handled by the mutation
        console.error('Password reset failed:', error);
      }
    },
    [token, resetMutation, reset, navigate]
  );

  const isLoading = useMemo(
    () => isSubmitting || resetMutation.isPending,
    [isSubmitting, resetMutation.isPending]
  );

  const errorMessage = useMemo(() => {
    if (resetMutation.error) {
      const error = resetMutation.error as Error & {
        error?: { message?: string };
      };
      if (error?.message) {
        return error.message;
      }
      if (error?.error?.message) {
        return error.error.message;
      }
      return 'Password reset failed. Please try again.';
    }
    return null;
  }, [resetMutation.error]);

  if (!token) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | App</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Container className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {isSubmitted ? 'Password Reset Successful' : 'Set New Password'}
              </CardTitle>
              <p className="text-muted-foreground">
                {isSubmitted
                  ? 'Your password has been updated. You will be redirected to sign in shortly.'
                  : 'Enter your new password below'}
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <Alert>
                  <AlertDescription>
                    Your password has been reset successfully. You can now use
                    your new password to sign in.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Error Alert */}
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      {...register('newPassword')}
                      disabled={isLoading}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
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
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                  </Button>

                  {/* Back to Login */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate('/auth')}
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
});
