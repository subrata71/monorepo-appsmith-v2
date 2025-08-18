import React from 'react';
import { useCalendarStore } from '@/entities/calendar';
import { CalendarGrid, CalendarHeader } from '@/features';
import { Container } from '@/shared';

export const CalendarPage = React.memo(() => {
  const year = useCalendarStore(state => state.year);
  const month = useCalendarStore(state => state.month);
  const days = useCalendarStore(state => state.days);
  const focusedDay = useCalendarStore(state => state.focusedDay);
  const goToPrevMonth = useCalendarStore(state => state.goToPrevMonth);
  const goToNextMonth = useCalendarStore(state => state.goToNextMonth);
  const focusDay = useCalendarStore(state => state.focusDay);

  const handlePrevMonth = React.useCallback(() => {
    goToPrevMonth();
  }, [goToPrevMonth]);

  const handleNextMonth = React.useCallback(() => {
    goToNextMonth();
  }, [goToNextMonth]);

  const handleDayFocus = React.useCallback(
    (dayIndex: number) => {
      focusDay(dayIndex);
    },
    [focusDay]
  );

  return (
    <Container className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />

          <CalendarGrid
            days={days}
            focusedDay={focusedDay}
            onDayFocus={handleDayFocus}
          />
        </div>
      </div>
    </Container>
  );
});
