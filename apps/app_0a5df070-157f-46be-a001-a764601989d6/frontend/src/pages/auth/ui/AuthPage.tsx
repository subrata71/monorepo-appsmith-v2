/**
 * Authentication Page
 *
 * Entry point for user registration, login, and password recovery
 */

import React, { useCallback, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Container } from '@/shared/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { RegisterForm } from '@/features/register-user';
import { LoginForm } from '@/features/login-user';
import { PasswordRecoveryForm } from '@/features/password-recovery';
import type { User } from '@/entities/user';

export const AuthPage = React.memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('login');

  const handleAuthSuccess = useCallback(
    (user: User) => {
      // TODO: Set user in authentication state
      console.log('User authenticated successfully:', user);

      // Redirect to dashboard after authentication
      navigate('/dashboard');
    },
    [navigate]
  );

  const handlePasswordRecoverySuccess = useCallback(() => {
    // Password recovery request sent successfully
    console.log('Password recovery request sent');
  }, []);

  const handleBackToLogin = useCallback(() => {
    setActiveTab('login');
  }, []);

  const pageTitle = useMemo(() => {
    switch (activeTab) {
      case 'login':
        return 'Sign In | App';
      case 'register':
        return 'Sign Up | App';
      case 'recovery':
        return 'Reset Password | App';
      default:
        return 'Authentication | App';
    }
  }, [activeTab]);

  const cardTitle = useMemo(() => {
    switch (activeTab) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Create Account';
      case 'recovery':
        return 'Reset Password';
      default:
        return 'Authentication';
    }
  }, [activeTab]);

  const cardDescription = useMemo(() => {
    switch (activeTab) {
      case 'login':
        return 'Enter your credentials to access your account';
      case 'register':
        return 'Enter your information to create your account';
      case 'recovery':
        return "We'll help you regain access to your account";
      default:
        return 'Authenticate to continue';
    }
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Container className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">{cardTitle}</CardTitle>
              <p className="text-muted-foreground">{cardDescription}</p>
            </CardHeader>
            <CardContent>
              {activeTab === 'recovery' ? (
                // Password recovery form (no tabs)
                <PasswordRecoveryForm
                  onSuccess={handlePasswordRecoverySuccess}
                  onBackToLogin={handleBackToLogin}
                />
              ) : (
                // Regular login/register tabs
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <LoginForm onSuccess={handleAuthSuccess} />

                    {/* Forgot Password Link */}
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => setActiveTab('recovery')}
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <RegisterForm onSuccess={handleAuthSuccess} />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
});
