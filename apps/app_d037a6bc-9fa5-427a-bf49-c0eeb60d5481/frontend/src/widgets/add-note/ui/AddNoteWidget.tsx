/**
 * Add Note Widget
 *
 * A floating action button that opens a modal dialog for creating new notes.
 * Provides an accessible, always-available interface for note creation.
 */

import React, { useCallback } from 'react';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription } from '@/shared/ui/alert';

import { useAddNoteStore, useCreateNote } from '@/features/add-note';

interface AddNoteWidgetProps {
  /** Optional className for the floating button */
  className?: string;
  /** Use navigation to full-page editor instead of modal */
  useEditor?: boolean;
}

/**
 * Add Note Form Component
 *
 * Form inside the modal for creating a new note
 */
const AddNoteForm = React.memo(() => {
  const modalOpen = useAddNoteStore(state => state.modalOpen);
  const fields = useAddNoteStore(state => state.fields);
  const submitting = useAddNoteStore(state => state.submitting);
  const submitError = useAddNoteStore(state => state.submitError);
  const fieldErrors = useAddNoteStore(state => state.fieldErrors);
  const setField = useAddNoteStore(state => state.setField);
  const closeModal = useAddNoteStore(state => state.closeModal);
  const setSubmitting = useAddNoteStore(state => state.setSubmitting);
  const setSubmitError = useAddNoteStore(state => state.setSubmitError);
  const setFieldErrors = useAddNoteStore(state => state.setFieldErrors);

  const createNoteMutation = useCreateNote();

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField('title', e.target.value);
    },
    [setField]
  );

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setField('body', e.target.value || null);
    },
    [setField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Clear previous errors
      setSubmitError(null);
      setFieldErrors({});

      // Basic validation
      if (!fields.title.trim()) {
        setFieldErrors({ title: 'Title is required' });
        return;
      }

      if (fields.title.length > 200) {
        setFieldErrors({ title: 'Title must be 200 characters or less' });
        return;
      }

      if (fields.body && fields.body.length > 10000) {
        setFieldErrors({
          body: 'Note content must be 10,000 characters or less',
        });
        return;
      }

      setSubmitting(true);

      try {
        await createNoteMutation.mutateAsync({
          title: fields.title.trim(),
          body: fields.body?.trim() || null,
        });

        // Success - close modal (this also resets the form)
        closeModal();
      } catch (error) {
        // Handle API errors
        if (error && typeof error === 'object' && 'cause' in error) {
          const cause = error.cause as Record<string, boolean>;
          if (cause) {
            // Convert boolean cause to field errors
            const fieldErrors: Record<string, string> = {};
            Object.keys(cause).forEach(field => {
              if (cause[field]) {
                fieldErrors[field] = `Please check your ${field}`;
              }
            });
            setFieldErrors(fieldErrors);
          }
        }

        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Failed to create note. Please try again.'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      fields,
      setSubmitError,
      setFieldErrors,
      setSubmitting,
      createNoteMutation,
      closeModal,
    ]
  );

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  if (!modalOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="note-title"
          className="text-sm font-medium text-foreground"
        >
          Title *
        </label>
        <Input
          id="note-title"
          type="text"
          value={fields.title}
          onChange={handleTitleChange}
          placeholder="Enter note title"
          disabled={submitting}
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? 'note-title-error' : undefined}
        />
        {fieldErrors.title && (
          <p id="note-title-error" className="text-sm text-destructive">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="note-body"
          className="text-sm font-medium text-foreground"
        >
          Content
        </label>
        <Textarea
          id="note-body"
          value={fields.body || ''}
          onChange={handleBodyChange}
          placeholder="Write your note content here..."
          disabled={submitting}
          rows={4}
          aria-invalid={!!fieldErrors.body}
          aria-describedby={fieldErrors.body ? 'note-body-error' : undefined}
        />
        {fieldErrors.body && (
          <p id="note-body-error" className="text-sm text-destructive">
            {fieldErrors.body}
          </p>
        )}
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || !fields.title.trim()}>
          {submitting ? 'Creating...' : 'Create Note'}
        </Button>
      </DialogFooter>
    </form>
  );
});

AddNoteForm.displayName = 'AddNoteForm';

/**
 * Main Add Note Widget Component
 *
 * Floating action button that opens a modal for creating new notes.
 * Always accessible and positioned fixed on the screen.
 */
export const AddNoteWidget = React.memo<AddNoteWidgetProps>(
  ({ className, useEditor = false }) => {
    const modalOpen = useAddNoteStore(state => state.modalOpen);
    const openModal = useAddNoteStore(state => state.openModal);
    const closeModal = useAddNoteStore(state => state.closeModal);

    const handleOpenModal = useCallback(() => {
      openModal();
    }, [openModal]);

    const handleCloseModal = useCallback(() => {
      closeModal();
    }, [closeModal]);

    // If using editor mode, render as a Link
    if (useEditor) {
      return (
        <Button
          size="lg"
          className={`fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 ${className || ''}`}
          aria-label="Add new note"
          asChild
        >
          <Link to="/new">
            <PlusIcon />
            <span className="sr-only sm:not-sr-only sm:ml-2">Add Note</span>
          </Link>
        </Button>
      );
    }

    // Default modal mode
    return (
      <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className={`fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 ${className || ''}`}
            onClick={handleOpenModal}
            aria-label="Add new note"
          >
            <PlusIcon />
            <span className="sr-only sm:not-sr-only sm:ml-2">Add Note</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>

          <AddNoteForm />
        </DialogContent>
      </Dialog>
    );
  }
);

AddNoteWidget.displayName = 'AddNoteWidget';
