import React, { useMemo } from 'react';
import { HabitItem } from '@/entities/habit';
import { useHabitSessionStore } from '@/features/habit-list/model/store';

export const HabitDisplay = React.memo(() => {
  const habits = useHabitSessionStore(state => state.habits);

  const habitItems = useMemo(
    () =>
      habits.map(habit => <HabitItem key={habit.id} habit={habit} />),
    [habits]
  );

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No habits added yet.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Add your first habit above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm text-muted-foreground mb-2">
        Your Habits ({habits.length})
      </h3>
      <div className="space-y-1 border rounded-md divide-y">
        {habitItems}
      </div>
    </div>
  );
});