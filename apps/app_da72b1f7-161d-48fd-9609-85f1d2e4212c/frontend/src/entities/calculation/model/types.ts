/**
 * Calculation entity types and interfaces
 * Defines the data structures for calculator operations and validation
 */

/**
 * Supported arithmetic operations
 */
export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

/**
 * Input validation errors for calculator fields
 */
export interface InputErrors {
  firstNumber?: string;
  secondNumber?: string;
}

/**
 * Props for the NumberInputField component
 */
export interface NumberInputFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
  error?: string;
  placeholder?: string;
}

/**
 * Data structure for calculation input
 */
export interface CalculationInput {
  firstNumber: number;
  secondNumber: number;
  operation: Operation;
}

/**
 * Result or error from a calculation
 */
export interface CalculationResult {
  result?: number;
  error?: string;
}

/**
 * Validation result for input fields
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
