/**
 * QuizStart Feature Component
 *
 * Feature for quiz start screen logic.
 * Combines QuizCard with start functionality.
 */

import React, { useCallback, useState } from 'react';
import { Button } from '@/shared/ui';
import { Quiz } from '@/entities';
import type { QuizStartProps, QuizStartState } from '../model/types';

export const QuizStart = ({ quiz, onStart }: QuizStartProps) => {
  const [state, setState] = useState<QuizStartState>({
    isStarting: false,
  });

  const handleStart = useCallback(async () => {
    setState(prev => ({ ...prev, isStarting: true }));
    
    try {
      await onStart();
    } finally {
      setState(prev => ({ ...prev, isStarting: false }));
    }
  }, [onStart]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <Quiz.QuizCard quiz={quiz} />
      <Button
        onClick={handleStart}
        disabled={state.isStarting}
        size="lg"
        className="w-full max-w-xs"
      >
        {state.isStarting ? 'Starting...' : 'Start Quiz'}
      </Button>
    </div>
  );
};