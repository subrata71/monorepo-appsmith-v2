/**
 * OptionItem Component
 *
 * Displays an individual answer option with selection state.
 */

import { cn } from '@/shared/lib/utils';
import type { Option, OptionState, OptionCallbacks } from '../model/types';

interface OptionItemProps {
  option: Option;
  selected: OptionState['selected'];
  disabled?: OptionState['disabled'];
  onSelect: OptionCallbacks['onSelect'];
  showCorrect?: boolean;
  showIncorrect?: boolean;
}

export const OptionItem = ({
  option,
  selected,
  disabled = false,
  onSelect,
  showCorrect = false,
  showIncorrect = false,
}: OptionItemProps) => {
  return (
    <button
      onClick={() => !disabled && onSelect(option.id)}
      disabled={disabled}
      className={cn(
        'w-full p-4 text-left border rounded-lg transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
        selected && !showIncorrect && 'bg-primary text-primary-foreground border-primary',
        showCorrect && 'bg-green-100 text-green-800 border-green-300',
        showIncorrect && 'bg-red-100 text-red-800 border-red-300',
        disabled && 'cursor-not-allowed',
        !disabled && 'hover:bg-muted'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{option.text}</span>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {selected && !showCorrect && !showIncorrect && (
            <div className="w-2 h-2 bg-current rounded-full" />
          )}
          {showCorrect && (
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          {showIncorrect && (
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✗</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
