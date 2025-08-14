import React from 'react';
import type { Habit } from '@/entities/habit';

interface HabitItemProps {
  habit: Habit;
}

export const HabitItem = React.memo<HabitItemProps>(({ habit }) => {
  return (
    <div className="py-2 px-1">
      <span className="text-sm">{habit.name}</span>
    </div>
  );
});
