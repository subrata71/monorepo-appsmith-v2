import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { BSTVisualizerPage } from '@/pages/bst-visualizer';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<BSTVisualizerPage />} />
      </Route>
    </Routes>
  );
};
