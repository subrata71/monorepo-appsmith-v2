import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { HomePage, GamePage } from '@/pages';
import { ROUTES } from '@/shared';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GAME} element={<GamePage />} />
      </Route>
    </Routes>
  );
};
