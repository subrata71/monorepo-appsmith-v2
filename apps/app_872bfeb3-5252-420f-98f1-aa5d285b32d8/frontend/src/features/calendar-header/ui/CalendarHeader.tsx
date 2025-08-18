import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatMonthYear } from '@/entities/calendar';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader = React.memo(
  ({ year, month, onPrev, onNext }: CalendarHeaderProps) => {
    const monthYearLabel = React.useMemo(
      () => formatMonthYear(year, month),
      [year, month]
    );

    const handlePrevClick = React.useCallback(() => {
      onPrev();
    }, [onPrev]);

    const handleNextClick = React.useCallback(() => {
      onNext();
    }, [onNext]);

    const handlePrevKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPrev();
        }
      },
      [onPrev]
    );

    const handleNextKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
      },
      [onNext]
    );

    return (
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevClick}
          onKeyDown={handlePrevKeyDown}
          aria-label="Previous month"
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2
          className="text-lg font-semibold"
          aria-live="polite"
          aria-label={`Calendar showing ${monthYearLabel}`}
        >
          {monthYearLabel}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextClick}
          onKeyDown={handleNextKeyDown}
          aria-label="Next month"
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
