import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';
import { Label } from './label';

interface TimePickerProps {
  /**
   * Current time value in HH:MM format (24-hour)
   */
  value?: string;
  /**
   * Callback when time changes
   */
  onChange?: (time: string) => void;
  /**
   * Optional label for the time picker
   */
  label?: string;
  /**
   * Whether the time picker is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
}

/**
 * TimePicker component for selecting time in HH:MM format
 *
 * Provides a simple time input with validation and accessibility features
 */
const TimePicker = React.memo(
  React.forwardRef<HTMLInputElement, TimePickerProps>(
    (
      {
        value = '',
        onChange,
        label,
        disabled,
        className,
        placeholder = 'Select time',
        ...props
      },
      ref
    ) => {
      const handleTimeChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          const newTime = event.target.value;
          onChange?.(newTime);
        },
        [onChange]
      );

      const inputId = React.useId();

      return (
        <div className={cn('space-y-2', className)}>
          {label && (
            <Label htmlFor={inputId} className="text-sm font-medium">
              {label}
            </Label>
          )}
          <Input
            ref={ref}
            id={inputId}
            type="time"
            value={value}
            onChange={handleTimeChange}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full"
            aria-label={label || 'Select time'}
            {...props}
          />
        </div>
      );
    }
  )
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };
export type { TimePickerProps };
