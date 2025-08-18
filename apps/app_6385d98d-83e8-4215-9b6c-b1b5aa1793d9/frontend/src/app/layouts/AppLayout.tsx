import { Outlet } from 'react-router-dom';
import { Container } from '@/shared';

export function AppLayout() {
  return (
    <Container className="min-h-screen bg-background flex flex-col">
      <Outlet />
    </Container>
  );
}
