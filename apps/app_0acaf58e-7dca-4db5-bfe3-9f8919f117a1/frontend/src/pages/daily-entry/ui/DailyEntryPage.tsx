/**
 * Daily Entry Page
 *
 * Main page for the daily one-sentence journal entry feature
 */

import React, { useCallback, useEffect } from 'react';
import { Container } from '@/shared/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  DailyEntryInput,
  DailyEntryCard,
  useDailyEntryStore,
} from '@/entities/daily-entry';

export const DailyEntryPage = React.memo(() => {
  // Store state
  const isLoading = useDailyEntryStore(state => state.isLoading);
  const entry = useDailyEntryStore(state => state.entry);
  const isEditing = useDailyEntryStore(state => state.isEditing);
  const canEdit = useDailyEntryStore(state => state.canEdit);

  // Store actions
  const reset = useDailyEntryStore(state => state.reset);
  const loadEntry = useDailyEntryStore(state => state.loadEntry);
  const saveEntry = useDailyEntryStore(state => state.saveEntry);
  const updateEntry = useDailyEntryStore(state => state.updateEntry);
  const setInput = useDailyEntryStore(state => state.setInput);
  const startEditing = useDailyEntryStore(state => state.startEditing);
  const cancelEditing = useDailyEntryStore(state => state.cancelEditing);

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle saving entry
  const handleSave = useCallback(
    async (sentence: string) => {
      // Update input in store first
      setInput(sentence);

      if (entry) {
        // If entry exists, update it
        await updateEntry();
      } else {
        // If no entry exists, create a new one
        await saveEntry();
      }
    },
    [entry, saveEntry, updateEntry, setInput]
  );

  // Handle canceling edit
  const handleCancel = useCallback(() => {
    cancelEditing();
  }, [cancelEditing]);

  // Handle starting edit mode
  const handleStartEdit = useCallback(() => {
    startEditing();
  }, [startEditing]);

  // Load today's entry on mount
  useEffect(() => {
    reset();
    loadEntry(); // Load today's entry
  }, [reset, loadEntry]);

  if (isLoading) {
    return (
      <Container className="max-w-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Loading...</h1>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-2xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Today's One-Sentence Journal
          </h1>
          <p className="text-lg text-muted-foreground">{today}</p>
          <p className="text-sm text-muted-foreground">
            Capture your day in a single, meaningful sentence.
          </p>
        </div>

        {/* Entry Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {entry && !isEditing
                ? 'Your Entry for Today'
                : "What's on your mind?"}
            </CardTitle>
            <CardDescription>
              {entry && !isEditing
                ? 'Your daily reflection has been saved. You can edit it until the day ends.'
                : 'Write one sentence that captures your thoughts, feelings, or experiences from today.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {entry && !isEditing ? (
              // Show saved entry with edit capability
              <DailyEntryCard
                sentence={entry.sentence}
                onEdit={handleStartEdit}
                canEdit={canEdit}
              />
            ) : (
              // Show input form
              <DailyEntryInput
                onSave={handleSave}
                onCancel={isEditing ? handleCancel : undefined}
                showCancelButton={isEditing}
              />
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>✍️ Keep it to one sentence (max 200 characters)</p>
          <p>⏰ You can edit your entry until the day ends</p>
          <p>🔒 Your entries are private and secure</p>
        </div>
      </div>
    </Container>
  );
});
