import React from 'react';
import { HabitRow } from '@/entities/habit';
import { useHabitSessionStore } from '../model/store';

export const HabitList = React.memo(() => {
  const habits = useHabitSessionStore((state) => state.habits);
  const toggleHabitCompletion = useHabitSessionStore((state) => state.toggleHabitCompletion);

  const handleToggleHabit = React.useCallback(
    (habitId: string) => {
      toggleHabitCompletion(habitId);
    },
    [toggleHabitCompletion]
  );

  if (habits.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No habits to display.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <HabitRow 
          key={habit.id} 
          habit={habit} 
          onToggle={handleToggleHabit} 
        />
      ))}
    </div>
  );
});