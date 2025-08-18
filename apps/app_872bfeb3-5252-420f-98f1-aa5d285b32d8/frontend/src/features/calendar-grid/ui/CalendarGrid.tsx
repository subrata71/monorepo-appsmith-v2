import React from 'react';
import type { DayCell } from '@/entities/calendar';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarWeekdayHeader } from './CalendarWeekdayHeader';

interface CalendarGridProps {
  days: DayCell[];
  focusedDay: number | null;
  onDayFocus?: (dayIndex: number) => void;
}

export const CalendarGrid = React.memo(
  ({ days, focusedDay, onDayFocus }: CalendarGridProps) => {
    return (
      <div
        className="w-full max-w-sm mx-auto"
        role="grid"
        aria-label="Calendar grid"
      >
        <CalendarWeekdayHeader />

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={`${day.date.toISOString()}-${index}`}
              role="gridcell"
              className="aspect-square"
            >
              <CalendarDayCell
                day={day}
                dayIndex={index}
                isFocused={focusedDay === index}
                onFocus={onDayFocus}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);
