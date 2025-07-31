import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { TreeVisualizerPage } from '@/pages/tree-visualizer';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<TreeVisualizerPage />} />
      </Route>
    </Routes>
  );
};
