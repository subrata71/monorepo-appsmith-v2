import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { AlarmTimeSelectionPage } from '@/pages/alarm-time-selection';

// Example routes - Replace with your actual pages
// import { HomePage } from '@/pages/home';
// import { <Entity>Page } from '@/pages/<entity>';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Alarm Time Selection Route */}
        <Route path="/alarm/time" element={<AlarmTimeSelectionPage />} />

        {/* Add your routes here following this pattern: */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/todos" element={<TodosPage />} /> */}
        {/* <Route path="/<entity>/new" element={<Create<Entity>Page />} /> */}
        {/* <Route path="/<entity>/:id" element={<<Entity>DetailPage />} /> */}
      </Route>
    </Routes>
  );
};
