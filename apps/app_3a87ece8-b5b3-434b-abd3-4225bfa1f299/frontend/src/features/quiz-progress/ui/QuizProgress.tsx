/**
 * QuizProgress Feature Component
 *
 * Feature for displaying quiz progress with visual indicator.
 */

import React, { useMemo } from 'react';
import { Progress } from '@/shared/ui';
import type { QuizProgressProps } from '../model/types';

export const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const progressValue = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }, [current, total]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Progress</span>
        <span>
          {current} of {total} questions
        </span>
      </div>
      <Progress value={progressValue} className="w-full" />
    </div>
  );
};
