import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { RoulettePage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to roulette page */}
        <Route path="/" element={<Navigate to="/roulette" replace />} />

        {/* Roulette page */}
        <Route path="/roulette" element={<RoulettePage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/roulette" replace />} />
      </Route>
    </Routes>
  );
};
