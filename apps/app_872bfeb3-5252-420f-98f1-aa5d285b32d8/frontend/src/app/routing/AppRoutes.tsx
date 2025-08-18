import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { CalendarPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route
          path="/404"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};
