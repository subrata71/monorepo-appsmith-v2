/**
 * QAImmediateFeedback Feature Component
 *
 * Handles answer selection, triggers immediate feedback display, 
 * manages disabling of options, and provides accessible feedback.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { ScreenReaderAnnouncer } from '@/shared/ui';
import { Option } from '@/entities';
import { useQALogicStore } from '../model/store';
import type { QAImmediateFeedbackProps } from '../model/types';

export const QAImmediateFeedback = React.memo(({
  question,
  onAnswered,
}: QAImmediateFeedbackProps) => {
  // Zustand store selectors - following guidelines to avoid object destructuring
  const currentQuestion = useQALogicStore(state => state.currentQuestion);
  const selectedOptionId = useQALogicStore(state => state.selectedOptionId);
  const feedback = useQALogicStore(state => state.feedback);
  const disabled = useQALogicStore(state => state.disabled);
  const setQuestion = useQALogicStore(state => state.setQuestion);
  const selectOption = useQALogicStore(state => state.selectOption);
  const reset = useQALogicStore(state => state.reset);

  // Set the current question when component mounts or question changes
  useEffect(() => {
    if (question.id !== currentQuestion?.id) {
      reset();
      setQuestion(question);
    }
  }, [question, currentQuestion, setQuestion, reset]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (!disabled) {
      selectOption(optionId);
      
      // Call the callback if provided
      if (onAnswered) {
        const isCorrect = optionId === question.correctOptionId;
        onAnswered(optionId, isCorrect);
      }
    }
  }, [disabled, selectOption, onAnswered, question.correctOptionId]);

  // Memoized feedback message for screen reader
  const screenReaderMessage = useMemo(() => {
    if (!feedback) return null;
    
    // Get the selected option text
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    const correctOption = question.options.find(opt => opt.id === question.correctOptionId);
    
    if (!selectedOption || !correctOption) return feedback;
    
    const isCorrect = selectedOptionId === question.correctOptionId;
    
    if (isCorrect) {
      return `Correct! You selected "${selectedOption.text}". ${feedback}`;
    } else {
      return `Incorrect. You selected "${selectedOption.text}". The correct answer is "${correctOption.text}". ${feedback}`;
    }
  }, [feedback, question, selectedOptionId]);

  return (
    <div className="space-y-6">
      {/* Question Display */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{question.text}</h2>
      </div>

      {/* Options List */}
      <div className="space-y-3" role="radiogroup" aria-labelledby="question-heading">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const showCorrect = disabled && isCorrectOption;
          const showIncorrect = disabled && isSelected && !isCorrectOption;
          
          return (
            <Option.OptionItem
              key={option.id}
              option={option}
              selected={isSelected}
              disabled={disabled}
              onSelect={handleOptionSelect}
              showCorrect={showCorrect}
              showIncorrect={showIncorrect}
            />
          );
        })}
      </div>

      {/* Feedback Display */}
      {feedback && (
        <div 
          className={`mt-6 p-4 rounded-lg border text-sm font-medium ${
            selectedOptionId === question.correctOptionId 
              ? 'text-green-800 bg-green-50 border-green-200' 
              : 'text-red-800 bg-red-50 border-red-200'
          }`}
          role="alert" 
          aria-live="polite"
        >
          {feedback}
        </div>
      )}

      {/* Screen Reader Announcer */}
      <ScreenReaderAnnouncer 
        message={screenReaderMessage}
        priority="assertive"
      />
    </div>
  );
});