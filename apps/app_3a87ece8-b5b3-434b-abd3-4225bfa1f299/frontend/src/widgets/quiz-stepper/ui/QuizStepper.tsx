/**
 * QuizStepper Widget Component
 *
 * Widget orchestrating quiz step flow (start, questions, results).
 * This is the main component for the quiz interface.
 */

import React, { useState, useCallback } from 'react';
import { Container } from '@/shared/ui';
import { QuizStart } from '@/features';
import type { QuizStepperProps, QuizStepperState } from '../model/types';

export const QuizStepper = ({ quiz }: QuizStepperProps) => {
  const [state, setState] = useState<QuizStepperState>({
    step: 'start',
    currentQuestionIndex: 0,
    attempt: null,
    loading: false,
    error: null,
  });

  const handleStart = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // For now, just move to question step
      // In future iterations, this will create a quiz attempt via API
      setState(prev => ({
        ...prev,
        step: 'question',
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to start quiz',
      }));
    }
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 'start':
        return (
          <QuizStart.QuizStart
            quiz={quiz}
            onStart={handleStart}
          />
        );
      case 'question':
        // Placeholder for future question navigation
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Question {state.currentQuestionIndex + 1}</h2>
            <p className="text-muted-foreground">Question navigation will be implemented in the next sub-item.</p>
          </div>
        );
      case 'results':
        // Placeholder for future results display
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <p className="text-muted-foreground">Results display will be implemented in a future sub-item.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {state.error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{state.error}</p>
          </div>
        )}
        {renderStep()}
      </div>
    </Container>
  );
};