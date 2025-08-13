/**
 * MoodHistoryPage
 *
 * Page for reviewing all previously logged mood entries in a scrollable,
 * visually distinct list. Displays mood history with timestamps and notes.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { MoodHistoryList } from '@/widgets/mood-history-list';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

export const MoodHistoryPage = () => {
  return (
    <>
      <Helmet>
        <title>Mood History | Mood Tracker</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/mood-entry">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Entry
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Mood History
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Review your mood journey over time
                  </p>
                </div>
              </div>
              <Link to="/mood-entry">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Entry
                </Button>
              </Link>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MoodHistoryList />
          </div>
        </div>
      </div>
    </>
  );
};
