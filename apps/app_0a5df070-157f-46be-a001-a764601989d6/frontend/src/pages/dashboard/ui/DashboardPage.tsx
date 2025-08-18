/**
 * Dashboard Page
 *
 * Main dashboard page after user authentication
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/shared/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

export const DashboardPage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Dashboard | App</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Container className="py-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have successfully registered and are now logged in to your
                account.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
});
