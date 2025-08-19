/**
 * Edit Note Page
 *
 * Page component for editing an existing note using the note editor widget.
 * Accessible via the /edit/:id route.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { NoteEditorWidget } from '@/widgets/note-editor';

export const EditNotePage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Edit Note | Notes App</title>
      </Helmet>

      <NoteEditorWidget />
    </>
  );
});

EditNotePage.displayName = 'EditNotePage';
