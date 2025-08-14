/**
 * Daily Entry Page
 * 
 * Main page for the daily one-sentence journal entry feature
 */

import React, { useCallback, useEffect } from 'react';
import { Container } from '@/shared/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { DailyEntryInput, useDailyEntryStore } from '@/entities/daily-entry';

export const DailyEntryPage = React.memo(() => {
  // Store state
  const isLoading = useDailyEntryStore(state => state.isLoading);
  const entry = useDailyEntryStore(state => state.entry);
  const isEditing = useDailyEntryStore(state => state.isEditing);
  const canEdit = useDailyEntryStore(state => state.canEdit);
  
  // Store actions
  const setError = useDailyEntryStore(state => state.setError);
  const setSaving = useDailyEntryStore(state => state.setSaving);
  const reset = useDailyEntryStore(state => state.reset);
  
  // Get today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  });
  
  // Handle saving entry (placeholder for now - will be implemented in save sub-item)
  const handleSave = useCallback(async (sentence: string) => {
    try {
      setSaving(true);
      setError(null);
      
      // TODO: This will be implemented in the "Save Entry" sub-item
      console.log('Saving entry:', sentence);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success
      alert(`Entry saved: "${sentence}"`);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  }, [setSaving, setError]);
  
  // Handle canceling edit (placeholder for now - will be implemented in edit sub-item)
  const handleCancel = useCallback(() => {
    // TODO: This will be implemented in the "Edit Today's Entry" sub-item
    console.log('Cancel editing');
  }, []);
  
  // Reset state on mount
  useEffect(() => {
    reset();
  }, [reset]);
  
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
          <h1 className="text-3xl font-bold tracking-tight">Today's One-Sentence Journal</h1>
          <p className="text-lg text-muted-foreground">
            {today}
          </p>
          <p className="text-sm text-muted-foreground">
            Capture your day in a single, meaningful sentence.
          </p>
        </div>
        
        {/* Entry Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {entry && !isEditing ? 'Your Entry for Today' : 'What\'s on your mind?'}
            </CardTitle>
            <CardDescription>
              {entry && !isEditing 
                ? 'Your daily reflection has been saved. You can edit it until the day ends.'
                : 'Write one sentence that captures your thoughts, feelings, or experiences from today.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {entry && !isEditing ? (
              // Show saved entry (will be implemented in edit sub-item)
              <div className="space-y-4">
                <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                  "{entry.sentence}"
                </blockquote>
                {canEdit && (
                  <div className="flex justify-end">
                    <button 
                      className="text-sm text-primary hover:underline"
                      onClick={() => console.log('Edit entry - will be implemented in edit sub-item')}
                    >
                      Edit Entry
                    </button>
                  </div>
                )}
              </div>
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