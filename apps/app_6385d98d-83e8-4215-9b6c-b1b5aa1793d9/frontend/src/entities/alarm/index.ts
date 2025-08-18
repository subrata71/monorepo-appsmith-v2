/**
 * Alarm Entity Public API
 *
 * Exports for the alarm entity following Feature-Sliced Design
 */

// Export types
export type {
  Alarm,
  AlarmCreate,
  AlarmUpdate,
  AlarmEntity,
  AlarmState,
} from './model/types';

// Export API queries
export {
  useMyAlarmQuery,
  useCreateAlarmMutation,
  useUpdateAlarmMutation,
  alarmKeys,
} from './api/queries';
