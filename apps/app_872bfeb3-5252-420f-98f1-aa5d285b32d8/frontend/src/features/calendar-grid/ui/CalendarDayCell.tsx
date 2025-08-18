import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { DayCell } from '@/entities/calendar';

interface CalendarDayCellProps {
  day: DayCell;
  isFocused: boolean;
  onFocus?: (dayIndex: number) => void;
  dayIndex: number;
}

export const CalendarDayCell = React.memo(
  ({ day, isFocused, onFocus, dayIndex }: CalendarDayCellProps) => {
    const handleClick = React.useCallback(() => {
      onFocus?.(dayIndex);
    }, [onFocus, dayIndex]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        // Allow keyboard navigation - this will be enhanced in future sub-items
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFocus?.(dayIndex);
        }
      },
      [onFocus, dayIndex]
    );

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'aspect-square h-auto w-full text-sm font-normal relative',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground',
          'data-[focused=true]:ring-2 data-[focused=true]:ring-ring',
          {
            'text-muted-foreground': !day.isCurrentMonth,
            'bg-primary text-primary-foreground hover:bg-primary/90':
              day.isToday,
            'ring-2 ring-ring': isFocused,
          }
        )}
        data-focused={isFocused}
        data-today={day.isToday}
        data-current-month={day.isCurrentMonth}
        aria-label={`${day.day}${day.isToday ? ', today' : ''}${!day.isCurrentMonth ? ', outside current month' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {day.day}
      </Button>
    );
  }
);
