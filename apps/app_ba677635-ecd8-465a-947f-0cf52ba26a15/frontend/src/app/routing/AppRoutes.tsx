import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { Game2048Page } from '@/pages/game-2048';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Game2048Page />} />
      </Route>
    </Routes>
  );
};
