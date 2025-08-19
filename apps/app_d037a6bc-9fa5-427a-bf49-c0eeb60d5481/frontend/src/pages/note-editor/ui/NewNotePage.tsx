/**
 * New Note Page
 *
 * Page component for creating a new note using the note editor widget.
 * Accessible via the /new route.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { NoteEditorWidget } from '@/widgets/note-editor';

export const NewNotePage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>New Note | Notes App</title>
      </Helmet>

      <NoteEditorWidget />
    </>
  );
});

NewNotePage.displayName = 'NewNotePage';
