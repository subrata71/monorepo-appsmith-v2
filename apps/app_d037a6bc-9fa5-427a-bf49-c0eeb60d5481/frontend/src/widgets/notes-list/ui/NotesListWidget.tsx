/**
 * Notes List Widget
 *
 * A scrollable list component that displays note titles and first lines.
 * This is the main List View component for the notes application.
 */

import React, { useMemo, useCallback } from 'react';

import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/ui/alert';

import type { Note } from '@/entities/note';
import { useNotesWithPagination } from '@/features/notes-listing';

interface NotesListWidgetProps {
  /** Optional className for styling */
  className?: string;
  /** Optional callback when a note is clicked */
  onNoteClick?: (note: Note) => void;
  /** Maximum height for the scrollable area */
  maxHeight?: string;
}

/**
 * Component to render a single note item in the list
 */
const NoteListItem = React.memo<{
  note: Note;
  onClick?: (note: Note) => void;
}>(({ note, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(note);
  }, [note, onClick]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // Extract first line from body for preview
  const firstLine = useMemo(() => {
    if (!note.body) return '';
    const lines = note.body.trim().split('\n');
    return lines[0]?.substring(0, 100) + (lines[0]?.length > 100 ? '...' : '');
  }, [note.body]);

  // Format date for display
  const formattedDate = useMemo(() => {
    const date = new Date(note.createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  }, [note.createdAt]);

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Open note: ${note.title}` : undefined}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-foreground flex-1 overflow-hidden">
            <span className="block truncate">{note.title}</span>
          </h3>
          <time
            className="text-sm text-muted-foreground flex-shrink-0"
            dateTime={note.createdAt}
          >
            {formattedDate}
          </time>
        </div>

        {firstLine && (
          <p className="text-sm text-muted-foreground overflow-hidden">
            <span className="block truncate">{firstLine}</span>
          </p>
        )}
      </div>
    </Card>
  );
});

NoteListItem.displayName = 'NoteListItem';

/**
 * Loading skeleton component for notes list
 */
const NotesListSkeleton = React.memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 3 }, (_, index) => (
      <Card key={index} className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    ))}
  </div>
));

NotesListSkeleton.displayName = 'NotesListSkeleton';

/**
 * Empty state component
 */
const EmptyNotesState = React.memo(() => (
  <div className="text-center py-12">
    <div className="text-muted-foreground">
      <h3 className="text-lg font-medium mb-2">No notes yet</h3>
      <p className="text-sm">Create your first note to get started.</p>
    </div>
  </div>
));

EmptyNotesState.displayName = 'EmptyNotesState';

/**
 * Main Notes List Widget Component
 *
 * Displays a scrollable list of notes with titles and first lines.
 * Handles loading, error, and empty states appropriately.
 */
export const NotesListWidget = React.memo<NotesListWidgetProps>(
  ({ className, onNoteClick, maxHeight = '600px' }) => {
    const { data, isLoading, isError, error } = useNotesWithPagination();

    const notesList = useMemo(() => data?.data ?? [], [data?.data]);

    const handleNoteClick = useCallback(
      (note: Note) => {
        onNoteClick?.(note);
      },
      [onNoteClick]
    );

    // Error state
    if (isError) {
      return (
        <div className={className}>
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : 'Failed to load notes. Please try again.'}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className={className}>
        <ScrollArea style={{ maxHeight }} className="w-full">
          <div className="space-y-4 p-1">
            {isLoading ? (
              <NotesListSkeleton />
            ) : notesList.length === 0 ? (
              <EmptyNotesState />
            ) : (
              notesList.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  onClick={onNoteClick ? handleNoteClick : undefined}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

NotesListWidget.displayName = 'NotesListWidget';
