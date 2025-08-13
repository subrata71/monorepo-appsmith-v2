/**
 * QuizQuestionForm Feature Component
 *
 * Feature for rendering and handling answer input for a question.
 * Combines QuestionCard with option selection logic.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Option } from '@/entities';
import type { QuizQuestionFormProps, QuizQuestionFormState } from '../model/types';

export const QuizQuestionForm = ({ 
  question, 
  onAnswer, 
  selectedOptionId 
}: QuizQuestionFormProps) => {
  const [state, setState] = useState<QuizQuestionFormState>({
    selectedOptionId: selectedOptionId || null,
  });

  // Sync with external selected option
  useEffect(() => {
    setState(prev => ({ ...prev, selectedOptionId: selectedOptionId || null }));
  }, [selectedOptionId]);

  const handleOptionSelect = useCallback((optionId: string) => {
    setState(prev => ({ ...prev, selectedOptionId: optionId }));
    onAnswer(optionId);
  }, [onAnswer]);

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{question.text}</h2>
      </div>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <Option.OptionItem
            key={option.id}
            option={option}
            selected={state.selectedOptionId === option.id}
            onSelect={handleOptionSelect}
          />
        ))}
      </div>
    </div>
  );
};