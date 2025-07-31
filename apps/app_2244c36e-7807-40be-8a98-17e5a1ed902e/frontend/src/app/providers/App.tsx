import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/app/routing/AppRoutes';

import { QueryClientProvider } from './QueryClientProvider';

export function App() {
  return (
    <QueryClientProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
