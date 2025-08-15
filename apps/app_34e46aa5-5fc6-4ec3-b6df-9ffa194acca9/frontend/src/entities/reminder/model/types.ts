/**
 * Reminder Domain Types
 * 
 * These types define the shape of reminder data for local state management.
 */

export interface Reminder {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderCreateInput {
  text: string;
}

export interface ReminderUpdateInput {
  text?: string;
  isCompleted?: boolean;
}

export interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

export interface ReminderActions {
  loadReminders: () => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, data: ReminderUpdateInput) => void;
  removeReminder: (id: string) => void;
  markAsDone: (id: string) => void;
  toggleCompletion: (id: string) => void;
}

export type ReminderStore = ReminderState & ReminderActions;