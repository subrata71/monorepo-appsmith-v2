/**
 * MoodOption Entity Component
 * 
 * Renders a single mood option as a selectable button with emoji, label, and selection state.
 */

import React from 'react';
import { Button } from '@/shared/ui/button.js';
import type { MoodType, MoodOptionData } from '@/entities/mood-entry';

export interface MoodOptionProps {
  type: MoodType;
  selected: boolean;
  onSelect: (mood: MoodType) => void;
  option: MoodOptionData;
  disabled?: boolean;
}

export const MoodOption = React.memo<MoodOptionProps>(({ 
  type, 
  selected, 
  onSelect, 
  option,
  disabled = false 
}) => {
  const handleSelect = React.useCallback(() => {
    if (!disabled) {
      onSelect(type);
    }
  }, [type, onSelect, disabled]);

  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="lg"
      onClick={handleSelect}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-2 p-4 h-auto min-h-24 w-full
        transition-all duration-200 ease-in-out
        ${selected 
          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
          : 'hover:scale-102'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-label={`Select ${option.label} mood`}
      aria-pressed={selected}
    >
      <span className="text-2xl" role="img" aria-label={option.label}>
        {option.emoji}
      </span>
      <span className="text-sm font-medium">
        {option.label}
      </span>
    </Button>
  );
});