import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { AuthPage } from '@/pages/auth';
import { HomePage } from '@/pages/home';
import { DashboardPage } from '@/pages/dashboard';
import { ResetPasswordPage } from '@/pages/reset-password';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Password Reset Route */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Add your other routes here following this pattern: */}
        {/* <Route path="/todos" element={<TodosPage />} /> */}
        {/* <Route path="/<entity>/new" element={<Create<Entity>Page />} /> */}
        {/* <Route path="/<entity>/:id" element={<<Entity>DetailPage />} /> */}
      </Route>
    </Routes>
  );
};
