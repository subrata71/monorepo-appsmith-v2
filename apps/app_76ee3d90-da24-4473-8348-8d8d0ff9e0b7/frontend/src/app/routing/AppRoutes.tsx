import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { TodoPage } from '@/pages/todo-page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<TodoPage />} />
        <Route path="/todos" element={<TodoPage />} />
      </Route>
    </Routes>
  );
};
