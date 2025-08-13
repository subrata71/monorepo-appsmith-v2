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
}

export const OptionItem = ({ option, selected, disabled = false, onSelect }: OptionItemProps) => {
  return (
    <button
      onClick={() => !disabled && onSelect(option.id)}
      disabled={disabled}
      className={cn(
        'w-full p-4 text-left border rounded-lg transition-colors',
        'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
        selected && 'bg-primary text-primary-foreground border-primary',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{option.text}</span>
        {selected && (
          <div className="w-2 h-2 bg-current rounded-full flex-shrink-0" />
        )}
      </div>
    </button>
  );
};