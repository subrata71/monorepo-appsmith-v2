/**
 * Option Entity Types
 *
 * Local types for option domain entities.
 */

export type { Option } from '@shared/api-types';

// Option interaction state
export interface OptionState {
  selected: boolean;
  disabled?: boolean;
}

// Option callback props
export interface OptionCallbacks {
  onSelect: (optionId: string) => void;
}
