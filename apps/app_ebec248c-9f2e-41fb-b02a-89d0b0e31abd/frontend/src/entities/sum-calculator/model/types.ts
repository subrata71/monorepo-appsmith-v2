export interface SumCalculationInput {
  firstNumber: number;
  secondNumber: number;
}

export interface SumCalculationResult {
  result: number;
}

export interface SumCalculatorState {
  firstNumber: string;
  secondNumber: string;
  isFirstNumberValid: boolean;
  isSecondNumberValid: boolean;
  isButtonEnabled: boolean;
  result: number | null;
  firstNumberError?: string;
  secondNumberError?: string;
}

export interface SumCalculatorActions {
  setFirstNumber: (value: string) => void;
  setSecondNumber: (value: string) => void;
  validateInputs: () => void;
  calculateSum: () => void;
  clearResult: () => void;
}

export type SumCalculatorStore = SumCalculatorState & SumCalculatorActions;
