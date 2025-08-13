/**
 * MoodEntryItem Entity Component
 *
 * Renders a single mood entry card or row, displaying mood icon/color, note, and timestamp.
 * Follows the entity layer pattern for mood entry data display.
 */

import React from 'react';
import type { MoodEntry } from '@/entities/mood-entry';
import { getMoodOption } from '@/entities/mood-entry';

export interface MoodEntryItemProps {
  /** The mood entry to display */
  moodEntry: MoodEntry;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format date to a readable string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

export const MoodEntryItem = React.memo<MoodEntryItemProps>(
  ({ moodEntry, className = '' }) => {
    const moodOption = getMoodOption(moodEntry.mood);

    if (!moodOption) {
      console.warn(`Unknown mood type: ${moodEntry.mood}`);
      return null;
    }

    return (
      <div
        className={`flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow ${className}`}
      >
        {/* Mood Icon and Color */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${moodOption.color}`}
        >
          <span className="text-xl" role="img" aria-label={moodOption.label}>
            {moodOption.emoji}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mood Label */}
          <h3 className="font-medium text-gray-900 mb-1">{moodOption.label}</h3>

          {/* Note */}
          {moodEntry.note && (
            <p className="text-gray-600 text-sm leading-relaxed mb-2 break-words">
              {moodEntry.note}
            </p>
          )}

          {/* Timestamp */}
          <time
            className="text-xs text-gray-400"
            dateTime={moodEntry.createdAt}
            title={new Date(moodEntry.createdAt).toLocaleString()}
          >
            {formatDate(moodEntry.createdAt)}
          </time>
        </div>
      </div>
    );
  }
);

MoodEntryItem.displayName = 'MoodEntryItem';
