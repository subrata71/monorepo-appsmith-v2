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
            position="bottom-right"
            expand={false}
            richColors={true}
            closeButton={true}
            toastOptions={{
              duration: 3000, // 3 seconds as per spec
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
