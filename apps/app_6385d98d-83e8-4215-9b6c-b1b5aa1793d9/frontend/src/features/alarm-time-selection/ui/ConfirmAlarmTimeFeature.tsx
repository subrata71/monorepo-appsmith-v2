import React from 'react';
import { Button, Alert, AlertDescription } from '@/shared/ui';

interface ConfirmAlarmTimeFeatureProps {
  /**
   * The selected time to confirm
   */
  time?: string;
  /**
   * Callback when confirm button is clicked
   */
  onConfirm: (time: string) => void;
  /**
   * Whether the confirmation is in progress (saving)
   */
  isLoading?: boolean;
  /**
   * Whether the current alarm exists (for update vs create)
   */
  hasExistingAlarm?: boolean;
  /**
   * Error message to display
   */
  error?: string | null;
}

/**
 * ConfirmAlarmTimeFeature - Feature for handling confirmation and API update
 *
 * This feature handles the confirmation logic for alarm time selection.
 * It provides a confirmation button with proper loading and error states.
 */
export const ConfirmAlarmTimeFeature = React.memo<ConfirmAlarmTimeFeatureProps>(
  ({
    time,
    onConfirm,
    isLoading = false,
    hasExistingAlarm = false,
    error = null,
  }) => {
    const handleConfirm = React.useCallback(() => {
      if (time) {
        onConfirm(time);
      }
    }, [time, onConfirm]);

    const isValidTime = React.useMemo(() => {
      return time && time.trim() !== '';
    }, [time]);

    const buttonText = React.useMemo(() => {
      if (isLoading) return 'Saving...';
      if (hasExistingAlarm) return 'Update Alarm';
      return 'Set Alarm';
    }, [isLoading, hasExistingAlarm]);

    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!isValidTime || isLoading}
          className="w-full"
          size="lg"
        >
          {buttonText}
        </Button>
      </div>
    );
  }
);

ConfirmAlarmTimeFeature.displayName = 'ConfirmAlarmTimeFeature';
