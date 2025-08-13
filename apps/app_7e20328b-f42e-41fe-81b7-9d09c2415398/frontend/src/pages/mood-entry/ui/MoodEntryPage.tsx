/**
 * MoodEntryPage
 *
 * Main page for mood entry functionality. Contains the complete mood entry form
 * with mood selection, note input, and submission capabilities.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MoodEntryForm } from '@/widgets/mood-entry-form';

export const MoodEntryPage = () => {
  const handleSubmitSuccess = React.useCallback(() => {
    // Optional: Add any additional logic after successful submission
    // For now, the form will reset automatically and show toast feedback
    console.log('Mood entry submitted successfully');
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MoodEntryForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </div>
    </>
  );
};
