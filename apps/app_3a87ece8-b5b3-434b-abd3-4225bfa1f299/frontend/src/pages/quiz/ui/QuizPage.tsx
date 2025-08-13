/**
 * Quiz Page Component
 *
 * Main page for taking a quiz from start to finish.
 * Uses QuizStepper widget to orchestrate the quiz flow.
 */

import React, { useState, useEffect } from 'react';
import { QuizStepper } from '@/widgets/quiz-stepper';
import type { QuizPageState } from '../model/types';
import { mockQuiz } from '../model/types';
import type { QuizAttempt } from '@shared/api-types';

export const QuizPage = () => {
  const [state, setState] = useState<QuizPageState>({
    quiz: null,
    loading: true,
    error: null,
  });

  // Load quiz data (currently using mock data)
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setState(prev => ({
          ...prev,
          quiz: mockQuiz,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load quiz',
        }));
      }
    };

    loadQuiz();
  }, []);

  const handleSubmit = (attempt: QuizAttempt) => {
    console.log('Quiz attempt completed:', attempt);
    // In future iterations, this will submit the attempt to the API
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{state.error}</p>
        </div>
      </div>
    );
  }

  if (!state.quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <p className="text-muted-foreground">The requested quiz could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <QuizStepper
      quiz={state.quiz}
      onSubmit={handleSubmit}
    />
  );
};