import React from 'react';
import { Button } from '@/shared/ui/button';
import { StreakBadge } from '@/shared/ui/streak-badge';
import type { Habit } from '../model/types';

interface HabitRowProps {
  habit: Habit;
  onMarkDone: (habitId: string) => void;
  onRemove?: (habitId: string) => void;
  canMarkDone?: boolean;
}

export const HabitRow = React.memo(
  ({ habit, onMarkDone, onRemove, canMarkDone = true }: HabitRowProps) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleMarkDone = React.useCallback(() => {
      if (!canMarkDone) return;

      onMarkDone(habit.id);
      setIsAnimating(true);

      // Reset animation after 1 second
      setTimeout(() => setIsAnimating(false), 1000);
    }, [habit.id, onMarkDone, canMarkDone]);

    const handleRemove = React.useCallback(() => {
      onRemove?.(habit.id);
    }, [habit.id, onRemove]);

    return (
      <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          <span
            className={`text-sm font-medium select-none ${
              habit.completed ? 'text-muted-foreground' : 'text-foreground'
            }`}
          >
            {habit.name}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <StreakBadge streak={habit.streak} animate={isAnimating} />

          <Button
            variant={canMarkDone ? 'default' : 'secondary'}
            size="sm"
            onClick={handleMarkDone}
            disabled={!canMarkDone}
            aria-label={`Mark ${habit.name} as done for today`}
          >
            {canMarkDone ? 'Mark as Done' : 'Done Today!'}
          </Button>

          {onRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              aria-label={`Remove ${habit.name} habit`}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    );
  }
);
