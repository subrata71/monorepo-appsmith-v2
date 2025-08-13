/**
 * MoodEntryPage
 * 
 * Main page for mood entry functionality. Contains the mood selection interface.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MoodSelection } from '@/features/mood-selection';
import type { MoodType } from '@/entities/mood-entry';

export const MoodEntryPage = () => {
  const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(null);

  const handleMoodSelect = React.useCallback((mood: MoodType) => {
    setSelectedMood(mood);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mood Entry | Mood Tracker</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mood Tracker
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Log your daily mood and thoughts privately in your browser
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MoodSelection
              selectedMood={selectedMood}
              onSelect={handleMoodSelect}
            />
          </div>

          {selectedMood && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Great choice! Future updates will allow you to add notes and save your mood entries.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};