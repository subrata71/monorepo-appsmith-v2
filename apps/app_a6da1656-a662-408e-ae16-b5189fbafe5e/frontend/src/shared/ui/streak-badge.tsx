import * as React from 'react';
import { Badge } from './badge';
import { cn } from '../lib/utils';

interface StreakBadgeProps {
  streak: number;
  animate?: boolean;
  className?: string;
}

export const StreakBadge = React.memo(
  ({ streak, animate = false, className }: StreakBadgeProps) => {
    return (
      <Badge
        variant="secondary"
        className={cn(
          'flex items-center gap-1 text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/50 dark:border-orange-800/50',
          animate && 'animate-pulse',
          className
        )}
      >
        <span className="text-orange-500">🔥</span>
        <span className="font-semibold">{streak}</span>
      </Badge>
    );
  }
);

StreakBadge.displayName = 'StreakBadge';
