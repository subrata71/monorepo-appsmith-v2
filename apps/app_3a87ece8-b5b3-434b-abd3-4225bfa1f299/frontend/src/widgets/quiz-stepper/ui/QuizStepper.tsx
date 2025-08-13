/**
 * QuizStepper Widget Component
 *
 * Widget orchestrating quiz step flow (start, questions, results).
 * This is the main component for the quiz interface.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Container } from '@/shared/ui';
import {
  QuizStart,
  QuizNavigator,
  QuizQuestionForm,
  QuizProgress,
} from '@/features';
import type { QuizStepperProps, QuizStepperState } from '../model/types';

export const QuizStepper = ({ quiz }: QuizStepperProps) => {
  const [state, setState] = useState<QuizStepperState>({
    step: 'start',
    currentQuestionIndex: 0,
    attempt: null,
    answers: {},
    loading: false,
    error: null,
  });

  // Computed values
  const currentQuestion = useMemo(() => {
    return quiz.questions[state.currentQuestionIndex] || null;
  }, [quiz.questions, state.currentQuestionIndex]);

  const isLastQuestion = useMemo(() => {
    return state.currentQuestionIndex === quiz.questions.length - 1;
  }, [state.currentQuestionIndex, quiz.questions.length]);

  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return undefined;
    return state.answers[currentQuestion.id];
  }, [currentQuestion, state.answers]);

  const canProceedToNext = useMemo(() => {
    return currentAnswer !== undefined;
  }, [currentAnswer]);

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

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;

      setState(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: optionId,
        },
      }));
    },
    [currentQuestion]
  );

  const handleNext = useCallback(async () => {
    if (!canProceedToNext) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (isLastQuestion) {
        // Move to results step
        setState(prev => ({
          ...prev,
          step: 'results',
          loading: false,
        }));
      } else {
        // Move to next question
        setState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          loading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to proceed',
      }));
    }
  }, [canProceedToNext, isLastQuestion]);

  const renderStep = () => {
    switch (state.step) {
      case 'start':
        return <QuizStart.QuizStart quiz={quiz} onStart={handleStart} />;
      case 'question':
        if (!currentQuestion) {
          return (
            <div className="text-center">
              <p className="text-muted-foreground">No questions available.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6 w-full max-w-4xl">
            <QuizProgress.QuizProgress
              current={state.currentQuestionIndex + 1}
              total={quiz.questions.length}
            />

            <QuizQuestionForm.QuizQuestionForm
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedOptionId={currentAnswer}
            />

            <QuizNavigator.QuizNavigator
              onNext={handleNext}
              step={state.currentQuestionIndex + 1}
              totalSteps={quiz.questions.length}
              canProceed={canProceedToNext}
            />
          </div>
        );
      case 'results':
        // Placeholder for future results display
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <p className="text-muted-foreground">
              Results display will be implemented in a future sub-item.
            </p>
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
