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

export const MoodOption = React.memo<MoodOptionProps>(
  ({ type, selected, onSelect, option, disabled = false }) => {
    const handleSelect = React.useCallback(() => {
      if (!disabled) {
        onSelect(type);
      }
    }, [type, onSelect, disabled]);

    return (
      <Button
        variant={selected ? 'default' : 'outline'}
        size="lg"
        onClick={handleSelect}
        disabled={disabled}
        className={`
        flex flex-col items-center gap-3 p-4 h-auto min-h-28 w-full
        rounded-2xl shadow-sm transition-all duration-300 ease-in-out
        border-2 font-medium
        ${option.color}
        ${
          selected
            ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-lg'
            : 'hover:scale-105 hover:shadow-md active:scale-95'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        aria-label={`Select ${option.label} mood`}
        aria-pressed={selected}
      >
        <span
          className="text-3xl animate-bounce"
          role="img"
          aria-label={option.label}
          style={{
            filter: selected
              ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              : 'none',
            animationDuration: selected ? '0.6s' : '2s',
            animationIterationCount: selected ? '2' : 'infinite',
            animationDelay: selected ? '0s' : `${Math.random() * 2}s`,
          }}
        >
          {option.emoji}
        </span>
        <span className="text-sm font-semibold tracking-wide">
          {option.label}
        </span>
      </Button>
    );
  }
);
