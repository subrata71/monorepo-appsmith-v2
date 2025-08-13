import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { MoodEntryPage } from '@/pages/mood-entry';
import { MoodHistoryPage } from '@/pages/mood-history';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to mood entry page */}
        <Route path="/" element={<Navigate to="/mood-entry" replace />} />

        {/* Mood entry page */}
        <Route path="/mood-entry" element={<MoodEntryPage />} />

        {/* Mood history page */}
        <Route path="/mood-history" element={<MoodHistoryPage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/mood-entry" replace />} />
      </Route>
    </Routes>
  );
};
