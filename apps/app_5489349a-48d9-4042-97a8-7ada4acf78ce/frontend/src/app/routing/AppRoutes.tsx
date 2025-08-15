import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { HeapSortVisualizerPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HeapSortVisualizerPage />} />
        <Route path="/heap-sort-visualizer" element={<HeapSortVisualizerPage />} />
      </Route>
    </Routes>
  );
};
