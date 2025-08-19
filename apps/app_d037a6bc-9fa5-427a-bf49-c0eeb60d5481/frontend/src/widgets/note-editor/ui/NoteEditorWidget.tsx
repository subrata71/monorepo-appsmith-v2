/**
 * Note Editor Widget
 *
 * A full-page minimal editor widget for creating or editing notes.
 * Features save button, keyboard shortcuts, and autosave functionality.
 */

import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Save, X } from 'lucide-react';

import { Button, NoteTextarea, Container } from '@/shared/ui';
import { useKeyboardShortcut } from '@/shared/lib/hooks/useKeyboardShortcut';
import { useAutosaveDraft } from '@/shared/lib/hooks/useAutosaveDraft';
import { useNote } from '@/entities/note';
import { useNoteEditorStore, useSaveNote } from '@/features/note-editor';

interface NoteEditorWidgetProps {
  className?: string;
}

export const NoteEditorWidget = React.memo<NoteEditorWidgetProps>(
  ({ className }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Note editor store state
    const mode = useNoteEditorStore(state => state.mode);
    const loading = useNoteEditorStore(state => state.loading);
    const saving = useNoteEditorStore(state => state.saving);
    const fields = useNoteEditorStore(state => state.fields);
    const fieldErrors = useNoteEditorStore(state => state.fieldErrors);

    // Store actions
    const setMode = useNoteEditorStore(state => state.setMode);
    const setNoteId = useNoteEditorStore(state => state.setNoteId);
    const loadNote = useNoteEditorStore(state => state.loadNote);
    const setField = useNoteEditorStore(state => state.setField);
    const setLoading = useNoteEditorStore(state => state.setLoading);
    const setSaving = useNoteEditorStore(state => state.setSaving);
    const resetEditor = useNoteEditorStore(state => state.resetEditor);

    // API hooks
    const { data: noteData, isLoading: isLoadingNote } = useNote(id || '');
    const { saveNote, isLoading: isSaving } = useSaveNote(id);

    const isEditing = mode === 'edit';
    const draftKey = isEditing && id ? `edit-${id}` : 'new';

    // Autosave draft functionality
    const { clearDraft, restoreDraft, hasDraft } = useAutosaveDraft({
      draftKey,
      value: fields,
      delay: 500,
      enabled: true,
    });

    // Initialize editor based on route
    useEffect(() => {
      if (id) {
        // Edit mode
        setMode('edit');
        setNoteId(id);
      } else {
        // New note mode
        setMode('new');
        setNoteId(null);
        resetEditor();
      }
    }, [id, setMode, setNoteId, resetEditor]);

    // Load existing note data
    useEffect(() => {
      if (isEditing && noteData) {
        loadNote(noteData);
      }
    }, [isEditing, noteData, loadNote]);

    // Restore draft for new notes
    useEffect(() => {
      if (!isEditing && !loading && hasDraft()) {
        const draft = restoreDraft();
        if (draft && (draft.title || draft.body)) {
          // Only restore if there's actual content
          // Draft restore is handled by the restoreDraft callback in the hook
        }
      }
    }, [isEditing, loading, hasDraft, restoreDraft]);

    // Update loading state
    useEffect(() => {
      setLoading(isLoadingNote);
    }, [isLoadingNote, setLoading]);

    // Update saving state
    useEffect(() => {
      setSaving(isSaving);
    }, [isSaving, setSaving]);

    // Handle field changes
    const handleTitleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    // Save action
    const handleSave = useCallback(async () => {
      if (!fields.title.trim()) {
        return; // Don't save if title is empty
      }

      try {
        await saveNote({
          title: fields.title.trim(),
          body: fields.body?.trim() || null,
        });

        // Clear draft after successful save
        clearDraft();
      } catch (error) {
        // Error handling is done in the useSaveNote hook
        console.error('Save failed:', error);
      }
    }, [fields, saveNote, clearDraft]);

    // Cancel action
    const handleCancel = useCallback(() => {
      clearDraft();
      navigate('/');
    }, [clearDraft, navigate]);

    // Keyboard shortcuts
    useKeyboardShortcut('ctrl+s', handleSave, {
      enabled: !saving && !!fields.title.trim(),
    });

    useKeyboardShortcut('escape', handleCancel);

    const canSave = !saving && !!fields.title.trim();
    const pageTitle = isEditing ? 'Edit Note' : 'New Note';

    if (loading) {
      return (
        <Container className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-4"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="h-40 bg-muted rounded"></div>
            </div>
          </div>
        </Container>
      );
    }

    return (
      <Container className={className}>
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              {pageTitle}
            </h1>

            {/* Save and Cancel Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          {/* Editor Form */}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <NoteTextarea
                value={fields.title}
                onChange={handleTitleChange}
                placeholder="Note title..."
                autoFocus={!isEditing}
                className="text-3xl font-bold border-none shadow-none bg-transparent p-0 resize-none overflow-hidden focus-visible:ring-0"
                aria-label="Note title"
              />
              {fieldErrors.title && (
                <p className="text-sm text-destructive mt-2">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Body Field */}
            <div>
              <NoteTextarea
                value={fields.body || ''}
                onChange={handleBodyChange}
                placeholder="Write your note here..."
                className="text-lg leading-relaxed"
                aria-label="Note content"
              />
              {fieldErrors.body && (
                <p className="text-sm text-destructive mt-2">
                  {fieldErrors.body}
                </p>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Press{' '}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>{' '}
              to save or{' '}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to
              cancel. Your draft is automatically saved as you type.
            </p>
          </div>
        </div>
      </Container>
    );
  }
);

NoteEditorWidget.displayName = 'NoteEditorWidget';
