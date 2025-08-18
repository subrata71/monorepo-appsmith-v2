import React from 'react';
import { WEEKDAY_LABELS } from '@/entities/calendar';

export const CalendarWeekdayHeader = React.memo(() => {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {WEEKDAY_LABELS.map(weekday => (
        <div
          key={weekday}
          className="flex h-9 items-center justify-center text-xs font-medium text-muted-foreground"
          role="columnheader"
          aria-label={weekday}
        >
          {weekday}
        </div>
      ))}
    </div>
  );
});
