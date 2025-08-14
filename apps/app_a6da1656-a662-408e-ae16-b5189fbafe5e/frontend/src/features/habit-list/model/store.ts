import { create } from 'zustand';
import type { Habit } from '@/entities/habit';

interface HabitSessionState {
  habits: Habit[];
  toggleHabitCompletion: (habitId: string) => void;
  addHabit: (name: string) => void;
  resetHabits: () => void;
}

// Default habits for the session
const getDefaultHabits = (): Habit[] => [
  { id: '1', name: 'Drink 8 glasses of water', completed: false },
  { id: '2', name: 'Exercise for 30 minutes', completed: false },
  { id: '3', name: 'Read for 15 minutes', completed: false },
  { id: '4', name: 'Practice mindfulness', completed: false },
  { id: '5', name: 'Write in journal', completed: false },
  { id: '6', name: 'Get 7-8 hours of sleep', completed: false },
];

export const useHabitSessionStore = create<HabitSessionState>(set => ({
  habits: getDefaultHabits(),
  toggleHabitCompletion: (habitId: string) =>
    set(state => ({
      habits: state.habits.map(habit =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      ),
    })),
  addHabit: (name: string) =>
    set(state => ({
      habits: [
        ...state.habits,
        {
          id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          completed: false,
        },
      ],
    })),
  resetHabits: () =>
    set({
      habits: getDefaultHabits(),
    }),
}));
