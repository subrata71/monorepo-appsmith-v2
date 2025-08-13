/**
 * MoodHistoryList Widget
 *
 * Widget that maps over mood history data and renders each entry as a MoodEntryItem
 * in a scrollable, styled list. Handles reverse chronological order and responsive layout.
 */

import React from 'react';
import type { MoodEntry } from '@/entities/mood-entry';
import { MoodEntryItem } from '@/entities/mood-entry/ui/MoodEntryItem';
import { getAllMoodEntries } from '@/shared/lib/mood-entry-storage';

export interface MoodHistoryListProps {
  /** Additional CSS classes */
  className?: string;
}

export const MoodHistoryList = React.memo<MoodHistoryListProps>(
  ({ className = '' }) => {
    const [entries, setEntries] = React.useState<MoodEntry[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Load entries from localStorage on mount
    React.useEffect(() => {
      const loadEntries = () => {
        try {
          const allEntries = getAllMoodEntries();
          // Entries are already sorted by newest first in the storage function
          setEntries(allEntries);
        } catch (error) {
          console.error('Failed to load mood entries:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadEntries();
    }, []);

    if (isLoading) {
      return (
        <div className={`${className}`}>
          <div className="text-center py-8">
            <div className="text-gray-500">Loading your mood history...</div>
          </div>
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <div className={`${className}`}>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No mood entries yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Start tracking your moods to see them appear here. All entries are
              stored privately in your browser.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${className}`}>
        {/* Header with count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Your Mood History
          </h2>
          <p className="text-sm text-gray-500">
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} logged so
            far
          </p>
        </div>

        {/* List of entries */}
        <div className="space-y-3">
          {entries.map(entry => (
            <MoodEntryItem
              key={entry.id}
              moodEntry={entry}
              className="w-full"
            />
          ))}
        </div>

        {/* Footer message */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            All mood entries are stored privately in your browser and never
            shared.
          </p>
        </div>
      </div>
    );
  }
);

MoodHistoryList.displayName = 'MoodHistoryList';
