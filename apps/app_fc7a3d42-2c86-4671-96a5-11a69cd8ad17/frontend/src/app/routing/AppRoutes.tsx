import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { TaskBoardPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<TaskBoardPage />} />
        <Route path="/task-board" element={<TaskBoardPage />} />
      </Route>
    </Routes>
  );
};
