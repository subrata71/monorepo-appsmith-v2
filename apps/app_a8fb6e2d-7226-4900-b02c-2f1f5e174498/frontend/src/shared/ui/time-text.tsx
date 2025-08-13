import { cn } from '@/shared/lib/utils';

interface TimeTextProps {
  value: string;
  className?: string;
}

export const TimeText = ({ value, className }: TimeTextProps) => {
  return (
    <span
      className={cn(
        'font-mono text-6xl font-bold tracking-wide text-foreground tabular-nums',
        className
      )}
      data-testid="time-text"
    >
      {value}
    </span>
  );
};