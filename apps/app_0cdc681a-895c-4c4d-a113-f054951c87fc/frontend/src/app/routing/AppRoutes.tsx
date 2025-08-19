import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { GamePage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<GamePage />} />
      </Route>
    </Routes>
  );
};
