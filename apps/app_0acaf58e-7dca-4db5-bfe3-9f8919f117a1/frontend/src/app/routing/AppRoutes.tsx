import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { DailyEntryPage } from '@/pages/daily-entry';

// Example routes - Replace with your actual pages
// import { HomePage } from '@/pages/home';
// import { <Entity>Page } from '@/pages/<entity>';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/daily-entry" element={<DailyEntryPage />} />
        <Route path="/" element={<DailyEntryPage />} />
        {/* Add your routes here following this pattern: */}
        {/* <Route path="/todos" element={<TodosPage />} /> */}
        {/* <Route path="/<entity>/new" element={<Create<Entity>Page />} /> */}
        {/* <Route path="/<entity>/:id" element={<<Entity>DetailPage />} /> */}
      </Route>
    </Routes>
  );
};
