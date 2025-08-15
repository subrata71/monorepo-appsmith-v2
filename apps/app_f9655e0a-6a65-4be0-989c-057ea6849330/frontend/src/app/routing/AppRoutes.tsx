import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { GraphEditorPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<GraphEditorPage />} />
        <Route path="/graphs/editor" element={<GraphEditorPage />} />
        <Route path="/graphs/editor/:id" element={<GraphEditorPage />} />
      </Route>
    </Routes>
  );
};
