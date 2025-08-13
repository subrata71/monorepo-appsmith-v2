/**
 * MoodSelection Feature Component
 *
 * Renders all mood options and handles mood selection state.
 * This component orchestrates the mood option entities.
 */

import React from 'react';
import { MoodOption } from '@/entities/mood-option';
import { MOOD_OPTIONS } from '@/entities/mood-entry';
import type { MoodType } from '@/entities/mood-entry';

export interface MoodSelectionProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

export const MoodSelection = React.memo<MoodSelectionProps>(
  ({ selectedMood, onSelect, disabled = false }) => {
    const moodOptions = React.useMemo(() => MOOD_OPTIONS, []);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ✨ How are you feeling today? ✨
          </h2>
          <p className="text-base text-muted-foreground mt-2 font-medium">
            Choose the mood that best represents your current feelings
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {moodOptions.map(option => (
            <MoodOption
              key={option.type}
              type={option.type}
              option={option}
              selected={selectedMood === option.type}
              onSelect={onSelect}
              disabled={disabled}
            />
          ))}
        </div>

        {selectedMood && (
          <div className="text-center p-4 bg-accent/20 rounded-xl border border-accent/30">
            <p className="text-lg text-accent-foreground">
              🎉 You selected:{' '}
              <span className="font-bold capitalize text-primary">
                {selectedMood}
              </span>{' '}
              🎉
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Great choice! Your feelings are important and valid.
            </p>
          </div>
        )}
      </div>
    );
  }
);
