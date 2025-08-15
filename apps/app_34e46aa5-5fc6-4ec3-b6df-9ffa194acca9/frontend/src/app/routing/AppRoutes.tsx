import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { HomePage } from '@/pages/home';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};
