/**
 * Calculation Store - Zustand store for calculator state management
 * Manages input values, validation errors, operations, and results
 */

import { create } from 'zustand';
import type {
  Operation,
  InputErrors,
} from '@/entities/calculation/model/types';

/**
 * Calculator state shape
 */
interface CalculationState {
  // Input values
  firstNumber: number | null;
  secondNumber: number | null;

  // Current operation
  operation: Operation | null;

  // Validation errors for inputs
  inputErrors: InputErrors;

  // Calculation result
  result: number | null;
  errorMessage: string | null;
}

/**
 * Calculator actions
 */
interface CalculationActions {
  // Input setters
  setFirstNumber: (value: number | null) => void;
  setSecondNumber: (value: number | null) => void;
  setOperation: (operation: Operation | null) => void;

  // Validation
  validateInputs: () => boolean;

  // Result management
  setResult: (result: number | null) => void;
  setErrorMessage: (message: string | null) => void;

  // Complete calculation workflow
  calculate: () => void;

  // Reset state
  reset: () => void;
}

type CalculationStore = CalculationState & CalculationActions;

/**
 * Validates a single number input
 */
function validateNumber(
  value: number | null,
  fieldName: string
): string | undefined {
  if (value === null) {
    return `${fieldName} is required`;
  }

  if (isNaN(value) || !isFinite(value)) {
    return `${fieldName} must be a valid number`;
  }

  return undefined;
}

/**
 * Performs arithmetic calculation
 */
function performCalculation(
  first: number,
  second: number,
  operation: Operation
): { result?: number; error?: string } {
  switch (operation) {
    case 'add':
      return { result: first + second };
    case 'subtract':
      return { result: first - second };
    case 'multiply':
      return { result: first * second };
    case 'divide':
      if (second === 0) {
        return { error: 'Cannot divide by zero' };
      }
      return { result: first / second };
    default:
      return { error: 'Unknown operation' };
  }
}

/**
 * Initial state for the calculator
 */
const initialState: CalculationState = {
  firstNumber: null,
  secondNumber: null,
  operation: null,
  inputErrors: {},
  result: null,
  errorMessage: null,
};

/**
 * Zustand store for calculator state management
 *
 * Usage (following Zustand rules - separate selector calls):
 * ```tsx
 * const firstNumber = useCalculationStore(state => state.firstNumber);
 * const setFirstNumber = useCalculationStore(state => state.setFirstNumber);
 * const inputErrors = useCalculationStore(state => state.inputErrors);
 * ```
 */
export const useCalculationStore = create<CalculationStore>((set, get) => ({
  ...initialState,

  setFirstNumber: value => {
    set(state => ({
      firstNumber: value,
      // Clear previous errors and results when input changes
      inputErrors: { ...state.inputErrors, firstNumber: undefined },
      result: null,
      errorMessage: null,
    }));
  },

  setSecondNumber: value => {
    set(state => ({
      secondNumber: value,
      // Clear previous errors and results when input changes
      inputErrors: { ...state.inputErrors, secondNumber: undefined },
      result: null,
      errorMessage: null,
    }));
  },

  setOperation: operation => {
    set({
      operation,
      result: null,
      errorMessage: null,
    });
  },

  validateInputs: () => {
    const state = get();
    const errors: InputErrors = {};

    const firstError = validateNumber(state.firstNumber, 'First number');
    const secondError = validateNumber(state.secondNumber, 'Second number');

    if (firstError) errors.firstNumber = firstError;
    if (secondError) errors.secondNumber = secondError;

    set({ inputErrors: errors });

    return Object.keys(errors).length === 0;
  },

  setResult: result => {
    set({ result, errorMessage: null });
  },

  setErrorMessage: errorMessage => {
    set({ errorMessage, result: null });
  },

  calculate: () => {
    const state = get();

    // Validate inputs first
    if (!get().validateInputs()) {
      return;
    }

    // Check if operation is selected
    if (!state.operation) {
      set({ errorMessage: 'Please select an operation' });
      return;
    }

    // Perform calculation
    const calculationResult = performCalculation(
      state.firstNumber!,
      state.secondNumber!,
      state.operation
    );

    if (calculationResult.error) {
      set({ errorMessage: calculationResult.error, result: null });
    } else {
      set({ result: calculationResult.result!, errorMessage: null });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
