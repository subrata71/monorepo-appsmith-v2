/**
 * QA Logic Page Component
 *
 * Page for presenting a single multiple-choice question, capturing answer selection, 
 * and providing immediate feedback in an accessible card layout.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@/shared/ui';
import { QAInteractionCard } from '@/widgets/qa-interaction-card';
import type { QALogicPageState } from '../model/types';
import { mockQuestion } from '../model/types';

export const QALogicPage = () => {
  const [state, setState] = useState<QALogicPageState>({
    question: null,
    loading: true,
    error: null,
  });

  // Load question data (currently using mock data)
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));

        setState(prev => ({
          ...prev,
          question: mockQuestion,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load question',
        }));
      }
    };

    loadQuestion();
  }, []);

  const handleAnswered = useCallback((optionId: string, isCorrect: boolean) => {
    console.log('Question answered:', { optionId, isCorrect });
    // In future iterations, this could track analytics or update user progress
  }, []);

  if (state.loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{state.error}</p>
        </div>
      </Container>
    );
  }

  if (!state.question) {
    return (
      <Container className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
          <p className="text-muted-foreground">
            The requested question could not be found.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Question and Answer Logic</h1>
          <p className="text-muted-foreground">
            Select an answer to receive immediate feedback
          </p>
        </div>

        <QAInteractionCard
          question={state.question}
          onAnswered={handleAnswered}
        />
      </div>
    </Container>
  );
};