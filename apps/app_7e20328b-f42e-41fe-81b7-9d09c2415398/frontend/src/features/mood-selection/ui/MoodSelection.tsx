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

export const MoodSelection = React.memo<MoodSelectionProps>(({
  selectedMood,
  onSelect,
  disabled = false
}) => {
  const moodOptions = React.useMemo(() => MOOD_OPTIONS, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          How are you feeling?
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Select your current mood
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {moodOptions.map((option) => (
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
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Selected: <span className="font-medium capitalize">{selectedMood}</span>
          </p>
        </div>
      )}
    </div>
  );
});