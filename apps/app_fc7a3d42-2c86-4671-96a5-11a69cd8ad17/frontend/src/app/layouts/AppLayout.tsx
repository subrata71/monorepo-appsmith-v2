import { Outlet } from 'react-router-dom';
import { Container } from '@/shared';
import { Toaster } from '@/shared/ui/sonner';

export function AppLayout() {
  return (
    <Container className="min-h-screen bg-background flex flex-col">
      <Outlet />
      <Toaster />
    </Container>
  );
}
