// Entity layer public API
export {
  NumberInputField,
  NumberInputDemo,
  validateNumberInput,
} from './number-input';
export type { NumberInputFieldProps, ValidationResult } from './number-input';

export { useSumCalculatorStore, SumCalculatorService } from './sum-calculator';
export type {
  SumCalculationInput,
  SumCalculationResult,
  SumCalculatorState,
  SumCalculatorActions,
  SumCalculatorStore,
} from './sum-calculator';
