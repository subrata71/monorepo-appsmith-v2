/**
 * Alarm Entity Types
 *
 * Types for the alarm domain entity
 */

import type { Alarm as BaseAlarm } from '@app/shared/api-types/alarm';

// Re-export the base alarm types for use within the alarm entity
export type {
  Alarm,
  AlarmCreate,
  AlarmUpdate,
} from '@app/shared/api-types/alarm';

// Additional client-side types for alarm entity
export type AlarmEntity = BaseAlarm;

// State shape for alarm-related stores
export interface AlarmState {
  alarm: AlarmEntity | null;
  loading: boolean;
  error: string | null;
  selectedTime: string | null;
  isSaving: boolean;
}
