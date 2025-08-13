/**
 * QA Logic Store
 *
 * State management for immediate feedback Q&A logic.
 * Manages current question, selected answer, disabled state, and feedback message.
 */

import { create } from 'zustand';
import type { Question } from '@shared/api-types';

export interface QALogicState {
  currentQuestion: Question | null;
  selectedOptionId: string | null;
  feedback: string | null;
  disabled: boolean;
}

interface QALogicActions {
  setQuestion: (question: Question) => void;
  selectOption: (optionId: string) => void;
  setFeedback: (feedback: string) => void;
  setDisabled: (disabled: boolean) => void;
  reset: () => void;
}

type QALogicStore = QALogicState & QALogicActions;

const initialState: QALogicState = {
  currentQuestion: null,
  selectedOptionId: null,
  feedback: null,
  disabled: false,
};

export const useQALogicStore = create<QALogicStore>((set) => ({
  ...initialState,

  setQuestion: (question) => set({ currentQuestion: question }),

  selectOption: (optionId) =>
    set((state) => {
      // Don't allow selection if already disabled
      if (state.disabled) return state;

      const question = state.currentQuestion;
      if (!question) return state;

      // Check if the selected option is correct
      const isCorrect = optionId === question.correctOptionId;
      const feedback = isCorrect 
        ? 'Correct! Well done.' 
        : 'Incorrect. The correct answer was highlighted.';

      return {
        selectedOptionId: optionId,
        feedback,
        disabled: true, // Disable further selections after answer
      };
    }),

  setFeedback: (feedback) => set({ feedback }),

  setDisabled: (disabled) => set({ disabled }),

  reset: () => set(initialState),
}));