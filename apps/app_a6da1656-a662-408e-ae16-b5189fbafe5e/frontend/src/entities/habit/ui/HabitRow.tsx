import React from 'react';
import { Checkbox } from '@/shared/ui/checkbox';
import type { Habit } from '../model/types';

interface HabitRowProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
}

export const HabitRow = React.memo(({ habit, onToggle }: HabitRowProps) => {
  const handleToggle = React.useCallback(
    (checked: boolean) => {
      onToggle(habit.id);
    },
    [habit.id, onToggle]
  );

  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
      <Checkbox
        checked={habit.completed}
        onCheckedChange={handleToggle}
        aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
      />
      <label 
        className={`text-sm font-medium cursor-pointer select-none flex-1 ${
          habit.completed 
            ? 'text-muted-foreground line-through' 
            : 'text-foreground'
        }`}
        onClick={() => handleToggle(!habit.completed)}
      >
        {habit.name}
      </label>
    </div>
  );
});