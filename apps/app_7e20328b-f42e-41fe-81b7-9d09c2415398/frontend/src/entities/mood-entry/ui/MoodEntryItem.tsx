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
        className={`flex items-start gap-4 p-6 bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] ${className}`}
      >
        {/* Mood Icon and Color */}
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 shadow-sm ${moodOption.color}`}
        >
          <span
            className="text-2xl animate-pulse"
            role="img"
            aria-label={moodOption.label}
          >
            {moodOption.emoji}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mood Label */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-foreground">
              {moodOption.label}
            </h3>
            <span className="text-sm text-primary">✨</span>
          </div>

          {/* Note */}
          {moodEntry.note && (
            <div className="bg-accent/10 rounded-lg p-3 mb-3 border border-accent/20">
              <p className="text-foreground text-sm leading-relaxed break-words">
                💭 {moodEntry.note}
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">🕒</span>
            <time
              className="text-xs text-muted-foreground font-medium"
              dateTime={moodEntry.createdAt}
              title={new Date(moodEntry.createdAt).toLocaleString()}
            >
              {formatDate(moodEntry.createdAt)}
            </time>
          </div>
        </div>
      </div>
    );
  }
);

MoodEntryItem.displayName = 'MoodEntryItem';
