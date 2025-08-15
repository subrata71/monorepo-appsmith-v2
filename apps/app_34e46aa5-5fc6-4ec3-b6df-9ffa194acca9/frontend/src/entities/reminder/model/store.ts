import { create } from 'zustand';
import type { ReminderStore, Reminder, ReminderUpdateInput } from './types';

/**
 * Reminder Store - Local State Management
 * 
 * Manages all reminders in local state without backend communication.
 * Includes sample data for demonstration purposes.
 */

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const createSampleReminders = (): Reminder[] => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return [
    {
      id: generateId(),
      text: 'Review weekly project updates',
      isCompleted: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId(),
      text: 'Call dentist to schedule appointment',
      isCompleted: false,
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
    },
    {
      id: generateId(),
      text: 'Buy groceries for the week',
      isCompleted: true,
      createdAt: yesterday.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: generateId(),
      text: 'Finish quarterly report',
      isCompleted: false,
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
    },
  ];
};

export const useReminderStore = create<ReminderStore>((set) => ({
  // State
  reminders: createSampleReminders(),
  loading: false,
  error: null,

  // Actions
  loadReminders: () => {
    set({ loading: true, error: null });
    // Simulate loading from local storage or other local source
    setTimeout(() => {
      set({ loading: false });
    }, 100);
  },

  addReminder: (reminder: Reminder) => {
    set((state) => ({
      reminders: [reminder, ...state.reminders],
    }));
  },

  updateReminder: (id: string, data: ReminderUpdateInput) => {
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : reminder
      ),
    }));
  },

  removeReminder: (id: string) => {
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id),
    }));
  },

  markAsDone: (id: string) => {
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              isCompleted: true,
              updatedAt: new Date().toISOString(),
            }
          : reminder
      ),
    }));
  },

  toggleCompletion: (id: string) => {
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              isCompleted: !reminder.isCompleted,
              updatedAt: new Date().toISOString(),
            }
          : reminder
      ),
    }));
  },
}));