/**
 * QuizNavigator Feature Component
 *
 * Feature for handling navigation between quiz steps.
 * Provides next button and navigation logic.
 */

import React, { useCallback, useState } from 'react';
import { Button } from '@/shared/ui';
import type { QuizNavigatorProps, QuizNavigatorState } from '../model/types';

export const QuizNavigator = ({ 
  onNext, 
  step, 
  totalSteps, 
  canProceed = false 
}: QuizNavigatorProps) => {
  const [state, setState] = useState<QuizNavigatorState>({
    isProcessing: false,
  });

  const handleNext = useCallback(async () => {
    if (!canProceed) return;
    
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      await onNext();
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [onNext, canProceed]);

  const isLastStep = step === totalSteps;

  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        Question {step} of {totalSteps}
      </div>
      
      <Button
        onClick={handleNext}
        disabled={!canProceed || state.isProcessing}
        size="lg"
      >
        {state.isProcessing 
          ? 'Processing...' 
          : isLastStep 
            ? 'View Results' 
            : 'Next Question'}
      </Button>
    </div>
  );
};