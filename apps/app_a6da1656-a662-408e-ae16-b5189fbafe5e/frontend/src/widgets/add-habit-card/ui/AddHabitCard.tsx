import React, { useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import { AddHabitForm } from '@/features/add-habit-form';
import { HabitDisplay } from '@/features/habit-display';
import { useHabitSessionStore } from '@/features/habit-list/model/store';

export const AddHabitCard = React.memo(() => {
  const addHabit = useHabitSessionStore(state => state.addHabit);

  const handleAddHabit = useCallback(
    (name: string) => {
      addHabit(name);
    },
    [addHabit]
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Add New Habit</h2>
          <p className="text-muted-foreground mt-1">
            Create a custom habit to track for this session.
          </p>
        </div>

        <AddHabitForm onAddHabit={handleAddHabit} />

        <HabitDisplay />
      </div>
    </Card>
  );
});