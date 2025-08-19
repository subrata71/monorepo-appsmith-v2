/**
 * Notes Page
 *
 * Main page that displays the notes list view.
 * This demonstrates how the NotesListWidget is used in a page context.
 */

import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import { Container } from '@/shared/ui/container';
import { NotesListWidget } from '@/widgets/notes-list';
import { AddNoteWidget } from '@/widgets/add-note';
import type { Note } from '@/entities/note';

export const NotesPage = React.memo(() => {
  // Handle note click - could navigate to detail view
  const handleNoteClick = useCallback((note: Note) => {
    console.log('Note clicked:', note);
    // TODO: Navigate to note detail view when implemented
  }, []);

  return (
    <>
      <Helmet>
        <title>Notes | Notes App</title>
      </Helmet>

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground mt-2">
              Your personal notes collection
            </p>
          </div>

          <NotesListWidget
            className="w-full"
            onNoteClick={handleNoteClick}
            maxHeight="calc(100vh - 200px)"
          />
        </div>

        {/* Add Note Button - Fixed positioned floating button */}
        <AddNoteWidget />
      </Container>
    </>
  );
});

NotesPage.displayName = 'NotesPage';
