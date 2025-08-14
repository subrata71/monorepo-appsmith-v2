import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { HabitsPage, AddHabitPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to habits page */}
        <Route path="/" element={<Navigate to="/habits" replace />} />

        {/* Habits page */}
        <Route path="/habits" element={<HabitsPage />} />

        {/* Add Habit page */}
        <Route path="/add-habit" element={<AddHabitPage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/habits" replace />} />
      </Route>
    </Routes>
  );
};
