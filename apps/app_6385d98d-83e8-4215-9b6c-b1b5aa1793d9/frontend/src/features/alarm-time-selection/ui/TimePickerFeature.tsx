import React from 'react';
import { TimePicker } from '@/shared/ui';

interface TimePickerFeatureProps {
  /**
   * Current time value in HH:MM format (24-hour)
   */
  value?: string;
  /**
   * Callback when time changes
   */
  onChange: (time: string) => void;
  /**
   * Whether the time picker is disabled
   */
  disabled?: boolean;
}

/**
 * TimePickerFeature - Feature for controlling the time picker logic and state
 *
 * This feature handles the time selection logic for alarm time selection.
 * It provides a clean interface for time picking with proper validation.
 */
export const TimePickerFeature = React.memo<TimePickerFeatureProps>(
  ({ value, onChange, disabled = false }) => {
    return (
      <TimePicker
        value={value}
        onChange={onChange}
        disabled={disabled}
        label="Alarm Time"
        placeholder="Select alarm time"
        className="w-full"
      />
    );
  }
);

TimePickerFeature.displayName = 'TimePickerFeature';
