/**
 * MoodEntryPage
 *
 * Main page for mood entry functionality. Contains the mood selection interface.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MoodSelection } from '@/features/mood-selection';
import { NoteInput } from '@/features/note-input';
import type { MoodType } from '@/entities/mood-entry';

export const MoodEntryPage = () => {
  const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(null);
  const [note, setNote] = React.useState<string>('');

  const handleMoodSelect = React.useCallback((mood: MoodType) => {
    setSelectedMood(mood);
  }, []);

  const handleNoteChange = React.useCallback((newNote: string) => {
    setNote(newNote);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mood Entry | Mood Tracker</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
            <p className="text-lg text-gray-600 mt-2">
              Log your daily mood and thoughts privately in your browser
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
            <MoodSelection
              selectedMood={selectedMood}
              onSelect={handleMoodSelect}
            />

            {selectedMood && (
              <div className="border-t border-gray-100 pt-6">
                <NoteInput
                  note={note}
                  onNoteChange={handleNoteChange}
                  maxLength={200}
                />
              </div>
            )}
          </div>

          {selectedMood && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {note.trim()
                  ? `Selected mood: ${selectedMood} with ${note.trim().split(/\s+/).length} word${note.trim().split(/\s+/).length !== 1 ? 's' : ''} in your note.`
                  : `Selected mood: ${selectedMood}. Add a note above to complete your entry.`}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Future updates will allow you to save your mood entries locally.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
