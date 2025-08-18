import React from 'react';
import { toast } from 'sonner';
import {
  TimePickerFeature,
  ConfirmAlarmTimeFeature,
  useAlarmTimeSelectionStore,
} from '@/features/alarm-time-selection';
import {
  useMyAlarmQuery,
  useCreateAlarmMutation,
  useUpdateAlarmMutation,
  type Alarm,
} from '@/entities/alarm';

interface AlarmTimeWidgetProps {
  /**
   * Optional existing alarm data
   */
  alarm?: Alarm | null;
  /**
   * Callback when time changes (optional)
   */
  onChangeTime?: (time: string) => void;
  /**
   * Callback when confirm is pressed (optional)
   */
  onConfirm?: (time: string, alarm: Alarm) => void;
}

/**
 * AlarmTimeWidget - Widget combining time picker UI and confirmation logic
 *
 * This widget orchestrates the alarm time selection flow, combining:
 * - TimePickerFeature for time selection
 * - ConfirmAlarmTimeFeature for confirmation
 * - API integration for alarm management
 * - Local state management for UI state
 */
export const AlarmTimeWidget = React.memo<AlarmTimeWidgetProps>(
  ({ alarm: propAlarm, onChangeTime, onConfirm }) => {
    // Fetch current alarm if not provided via props
    const { data: fetchedAlarm, error: fetchError } = useMyAlarmQuery();
    const currentAlarm = propAlarm || fetchedAlarm;

    // API mutations
    const createAlarmMutation = useCreateAlarmMutation();
    const updateAlarmMutation = useUpdateAlarmMutation();

    // Local UI state
    const selectedTime = useAlarmTimeSelectionStore(
      state => state.selectedTime
    );
    const isSaving = useAlarmTimeSelectionStore(state => state.isSaving);
    const error = useAlarmTimeSelectionStore(state => state.error);
    const setSelectedTime = useAlarmTimeSelectionStore(
      state => state.setSelectedTime
    );
    const setSaving = useAlarmTimeSelectionStore(state => state.setSaving);
    const setError = useAlarmTimeSelectionStore(state => state.setError);

    // Initialize selected time with current alarm time
    React.useEffect(() => {
      if (currentAlarm?.time && !selectedTime) {
        setSelectedTime(currentAlarm.time);
      }
    }, [currentAlarm?.time, selectedTime, setSelectedTime]);

    const handleTimeChange = React.useCallback(
      (time: string) => {
        setSelectedTime(time);
        onChangeTime?.(time);
      },
      [setSelectedTime, onChangeTime]
    );

    const handleConfirm = React.useCallback(
      async (time: string) => {
        try {
          setSaving(true);
          setError(null);

          let result: Alarm;

          if (currentAlarm) {
            // Update existing alarm
            result = await updateAlarmMutation.mutateAsync({ time });
            toast.success('Alarm updated successfully!');
          } else {
            // Create new alarm
            result = await createAlarmMutation.mutateAsync({ time });
            toast.success('Alarm set successfully!');
          }

          onConfirm?.(time, result);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to save alarm';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setSaving(false);
        }
      },
      [
        currentAlarm,
        createAlarmMutation,
        updateAlarmMutation,
        setSaving,
        setError,
        onConfirm,
      ]
    );

    // Handle fetch error
    const displayError = React.useMemo(() => {
      if (error) return error;
      if (fetchError && fetchError.message !== 'No alarm found for user') {
        return 'Failed to load current alarm';
      }
      return null;
    }, [error, fetchError]);

    const isLoading = React.useMemo(() => {
      return (
        isSaving ||
        createAlarmMutation.isPending ||
        updateAlarmMutation.isPending
      );
    }, [
      isSaving,
      createAlarmMutation.isPending,
      updateAlarmMutation.isPending,
    ]);

    return (
      <div className="space-y-6 max-w-md mx-auto">
        <TimePickerFeature
          value={selectedTime}
          onChange={handleTimeChange}
          disabled={isLoading}
        />

        <ConfirmAlarmTimeFeature
          time={selectedTime}
          onConfirm={handleConfirm}
          isLoading={isLoading}
          hasExistingAlarm={Boolean(currentAlarm)}
          error={displayError}
        />
      </div>
    );
  }
);

AlarmTimeWidget.displayName = 'AlarmTimeWidget';
