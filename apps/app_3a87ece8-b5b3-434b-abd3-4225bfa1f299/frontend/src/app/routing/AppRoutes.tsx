import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { QuizPage } from '@/pages/quiz';
import { QALogicPage } from '@/pages/qa-logic';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to quiz page */}
        <Route path="/" element={<Navigate to="/quiz" replace />} />

        {/* Quiz route */}
        <Route path="/quiz" element={<QuizPage />} />
        
        {/* QA Logic route */}
        <Route path="/qa-logic" element={<QALogicPage />} />

        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Route>
    </Routes>
  );
};
