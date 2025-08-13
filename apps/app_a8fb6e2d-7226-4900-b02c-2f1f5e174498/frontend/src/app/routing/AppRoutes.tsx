import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { StopwatchPage } from '@/pages/stopwatch';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to stopwatch page */}
        <Route path="/" element={<Navigate to="/stopwatch" replace />} />
        <Route path="/stopwatch" element={<StopwatchPage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/stopwatch" replace />} />
      </Route>
    </Routes>
  );
};
