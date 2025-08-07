import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { CalculatorPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CalculatorPage />} />
      </Route>
    </Routes>
  );
};
