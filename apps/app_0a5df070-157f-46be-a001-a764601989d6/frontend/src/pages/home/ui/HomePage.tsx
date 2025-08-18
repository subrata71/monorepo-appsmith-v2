/**
 * Home Page
 *
 * Landing page that redirects to authentication
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

export const HomePage = React.memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to authentication page for now
    navigate('/auth', { replace: true });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>App</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to authentication...</p>
      </div>
    </>
  );
});
