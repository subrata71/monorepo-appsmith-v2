import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { QuizPage } from '@/pages/quiz';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to quiz page */}
        <Route path="/" element={<Navigate to="/quiz" replace />} />
        
        {/* Quiz route */}
        <Route path="/quiz" element={<QuizPage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Route>
    </Routes>
  );
};
