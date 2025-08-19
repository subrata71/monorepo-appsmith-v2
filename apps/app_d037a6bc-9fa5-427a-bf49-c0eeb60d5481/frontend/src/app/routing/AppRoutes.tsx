import { Routes, Route } from 'react-router';
import { AppLayout } from '@/app/layouts';
import { NotesPage, NewNotePage, EditNotePage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<NotesPage />} />
        <Route path="/new" element={<NewNotePage />} />
        <Route path="/edit/:id" element={<EditNotePage />} />
      </Route>
    </Routes>
  );
};
