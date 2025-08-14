import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { HabitsPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to habits page */}
        <Route path="/" element={<Navigate to="/habits" replace />} />
        
        {/* Habits page */}
        <Route path="/habits" element={<HabitsPage />} />
        
        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/habits" replace />} />
      </Route>
    </Routes>
  );
};
