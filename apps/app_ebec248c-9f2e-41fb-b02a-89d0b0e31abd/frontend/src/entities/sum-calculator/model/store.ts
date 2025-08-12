import { create } from 'zustand';
import { SumCalculatorService } from '../lib/sumCalculatorService';
import type { SumCalculatorStore } from './types';

export const useSumCalculatorStore = create<SumCalculatorStore>((set, get) => ({
  // State
  firstNumber: '',
  secondNumber: '',
  isFirstNumberValid: false,
  isSecondNumberValid: false,
  isButtonEnabled: false,
  result: null,
  firstNumberError: undefined,
  secondNumberError: undefined,

  // Actions
  setFirstNumber: (value: string) => {
    set({
      firstNumber: value,
      result: null, // Clear result when input changes
    });
    // Trigger validation after state update
    setTimeout(() => get().validateInputs(), 0);
  },

  setSecondNumber: (value: string) => {
    set({
      secondNumber: value,
      result: null, // Clear result when input changes
    });
    // Trigger validation after state update
    setTimeout(() => get().validateInputs(), 0);
  },

  validateInputs: () => {
    const { firstNumber, secondNumber } = get();

    const firstNumberError =
      SumCalculatorService.validateSingleInput(firstNumber);
    const secondNumberError =
      SumCalculatorService.validateSingleInput(secondNumber);

    const isFirstNumberValid = !firstNumberError;
    const isSecondNumberValid = !secondNumberError;
    const isButtonEnabled = isFirstNumberValid && isSecondNumberValid;

    set({
      isFirstNumberValid,
      isSecondNumberValid,
      isButtonEnabled,
      firstNumberError,
      secondNumberError,
    });
  },

  calculateSum: () => {
    const { firstNumber, secondNumber, isButtonEnabled } = get();

    if (!isButtonEnabled) {
      return;
    }

    const result = SumCalculatorService.calculateSum(firstNumber, secondNumber);
    set({ result });
  },

  clearResult: () => {
    set({ result: null });
  },
}));
