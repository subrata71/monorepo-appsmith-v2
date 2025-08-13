/**
 * MoodEntryPage
 *
 * Main page for mood entry functionality. Contains the complete mood entry form
 * with mood selection, note input, and submission capabilities.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { MoodEntryForm } from '@/widgets/mood-entry-form';
import { Button } from '@/shared/ui/button';
import { History } from 'lucide-react';

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
            <div className="flex items-center justify-between mb-6">
              <div></div>
              <Link to="/mood-history">
                <Button variant="outline" className="gap-2">
                  <History className="w-4 h-4" />
                  View History
                </Button>
              </Link>
            </div>
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
