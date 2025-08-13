import { useMemo } from 'react';
import { TimeText } from '@/shared/ui';
import { formatTime } from '../lib/format-time';

interface StopwatchDisplayProps {
  elapsedTime: number;
  className?: string;
}

export const StopwatchDisplay = ({ elapsedTime, className }: StopwatchDisplayProps) => {
  const formattedTime = useMemo(() => formatTime(elapsedTime), [elapsedTime]);

  return (
    <div className="flex justify-center items-center" data-testid="stopwatch-display">
      <TimeText value={formattedTime} className={className} />
    </div>
  );
};