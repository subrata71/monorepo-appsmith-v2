import { Routes, Route, Navigate } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { ContactPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Redirect root to contact page */}
        <Route path="/" element={<Navigate to="/contact" replace />} />
        
        {/* Contact Us page */}
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Catch undefined routes */}
        <Route path="*" element={<Navigate to="/contact" replace />} />
      </Route>
    </Routes>
  );
};
