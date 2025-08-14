import { create } from 'zustand';
import type { Habit } from '@/entities/habit';

interface HabitSessionState {
  habits: Habit[];
  toggleHabitCompletion: (habitId: string) => void;
  addHabit: (name: string) => void;
  removeHabit: (habitId: string) => void;
  resetHabits: () => void;
  incrementHabitStreak: (habitId: string) => void;
  canIncrementStreak: (habitId: string) => boolean;
}

// Helper function to get current day as string
const getCurrentDay = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Default habits for the session
const getDefaultHabits = (): Habit[] => [
  {
    id: '1',
    name: 'Drink 8 glasses of water',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
  {
    id: '2',
    name: 'Exercise for 30 minutes',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
  {
    id: '3',
    name: 'Read for 15 minutes',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
  {
    id: '4',
    name: 'Practice mindfulness',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
  {
    id: '5',
    name: 'Write in journal',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
  {
    id: '6',
    name: 'Get 7-8 hours of sleep',
    completed: false,
    streak: 0,
    lastCompletedDate: '',
  },
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
          streak: 0,
          lastCompletedDate: '',
        },
      ],
    })),
  removeHabit: (habitId: string) =>
    set(state => ({
      habits: state.habits.filter(habit => habit.id !== habitId),
    })),
  resetHabits: () =>
    set({
      habits: getDefaultHabits(),
    }),
  incrementHabitStreak: (habitId: string) =>
    set(state => {
      const today = getCurrentDay();
      return {
        habits: state.habits.map(habit =>
          habit.id === habitId && habit.lastCompletedDate !== today
            ? {
                ...habit,
                streak: habit.streak + 1,
                lastCompletedDate: today,
                completed: true,
              }
            : habit
        ),
      };
    }),
  canIncrementStreak: (habitId: string) => {
    const today = getCurrentDay();
    const habit = useHabitSessionStore
      .getState()
      .habits.find(h => h.id === habitId);
    return habit ? habit.lastCompletedDate !== today : false;
  },
}));
