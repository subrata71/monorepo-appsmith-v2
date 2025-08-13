import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from '@/app/routing/AppRoutes';
import { Toaster } from '@/shared/ui/sonner';

import { QueryClientProvider } from './QueryClientProvider';

export function App() {
  return (
    <QueryClientProvider>
      <HelmetProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster 
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                padding: '12px 16px',
              },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
