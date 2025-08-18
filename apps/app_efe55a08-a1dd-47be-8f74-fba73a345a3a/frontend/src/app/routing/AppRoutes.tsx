import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { ChatPage } from '@/pages/chat';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/chat" element={<ChatPage />} />
        {/* Add more routes here following this pattern: */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/todos" element={<TodosPage />} /> */}
        {/* <Route path="/<entity>/new" element={<Create<Entity>Page />} /> */}
        {/* <Route path="/<entity>/:id" element={<<Entity>DetailPage />} /> */}
      </Route>
    </Routes>
  );
};
