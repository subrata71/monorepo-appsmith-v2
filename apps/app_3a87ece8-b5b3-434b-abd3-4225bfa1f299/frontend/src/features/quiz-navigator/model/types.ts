/**
 * QuizNavigator Feature Types
 *
 * Types for handling navigation between quiz steps.
 */

// QuizNavigator feature props
export interface QuizNavigatorProps {
  onNext: () => void;
  step: number;
  totalSteps: number;
  canProceed?: boolean;
}

// QuizNavigator feature state
export interface QuizNavigatorState {
  isProcessing: boolean;
}