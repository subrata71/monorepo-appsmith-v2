import React from 'react';
import { HabitRow } from '@/entities/habit';
import { useHabitSessionStore } from '../model/store';

export const HabitList = React.memo(() => {
  const habits = useHabitSessionStore(state => state.habits);
  const incrementHabitStreak = useHabitSessionStore(
    state => state.incrementHabitStreak
  );
  const canIncrementStreak = useHabitSessionStore(
    state => state.canIncrementStreak
  );
  const removeHabit = useHabitSessionStore(state => state.removeHabit);

  const handleMarkHabitDone = React.useCallback(
    (habitId: string) => {
      incrementHabitStreak(habitId);
    },
    [incrementHabitStreak]
  );

  const handleRemoveHabit = React.useCallback(
    (habitId: string) => {
      removeHabit(habitId);
    },
    [removeHabit]
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
      {habits.map(habit => (
        <HabitRow
          key={habit.id}
          habit={habit}
          onMarkDone={handleMarkHabitDone}
          onRemove={handleRemoveHabit}
          canMarkDone={canIncrementStreak(habit.id)}
        />
      ))}
    </div>
  );
});
