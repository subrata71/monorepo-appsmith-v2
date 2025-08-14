import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { ColorPickerPage } from '@/pages/color-picker';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to color picker page */}
        <Route
          path="/"
          element={<Navigate to="/color-picker-html" replace />}
        />

        {/* Color picker page */}
        <Route path="/color-picker-html" element={<ColorPickerPage />} />

        {/* Catch undefined routes */}
        <Route
          path="*"
          element={<Navigate to="/color-picker-html" replace />}
        />
      </Route>
    </Routes>
  );
};
