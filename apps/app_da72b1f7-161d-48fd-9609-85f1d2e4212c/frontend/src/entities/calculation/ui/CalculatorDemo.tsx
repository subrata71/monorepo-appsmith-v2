/**
 * CalculatorDemo - Demonstration component showing number input fields with validation
 * This demonstrates the real-time validation and button state management
 */

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { NumberInputField } from './NumberInputField';
import { useCalculationStore } from '@/features/calculation';

/**
 * Demo component showing the calculator number inputs with validation
 * Demonstrates how operation buttons are disabled when inputs are invalid
 */
export function CalculatorDemo() {
  // Following Zustand rules - separate selector calls
  const firstNumber = useCalculationStore(state => state.firstNumber);
  const secondNumber = useCalculationStore(state => state.secondNumber);
  const inputErrors = useCalculationStore(state => state.inputErrors);
  const setFirstNumber = useCalculationStore(state => state.setFirstNumber);
  const setSecondNumber = useCalculationStore(state => state.setSecondNumber);
  const result = useCalculationStore(state => state.result);
  const errorMessage = useCalculationStore(state => state.errorMessage);
  const calculate = useCalculationStore(state => state.calculate);
  const setOperation = useCalculationStore(state => state.setOperation);

  // Check if operation buttons should be disabled
  const hasInputErrors = Object.keys(inputErrors).length > 0;
  const hasEmptyInputs = firstNumber === null || secondNumber === null;
  const shouldDisableButtons = hasInputErrors || hasEmptyInputs;

  const handleOperationClick = (
    operation: 'add' | 'subtract' | 'multiply' | 'divide'
  ) => {
    setOperation(operation);
    calculate();
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Simple Calculator</h1>
          <p className="text-muted-foreground">
            Enter two numbers to see validation in action
          </p>
        </div>

        <div className="space-y-4">
          <NumberInputField
            value={firstNumber}
            onChange={setFirstNumber}
            label="First Number"
            error={inputErrors.firstNumber}
          />

          <NumberInputField
            value={secondNumber}
            onChange={setSecondNumber}
            label="Second Number"
            error={inputErrors.secondNumber}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleOperationClick('add')}
            disabled={shouldDisableButtons}
          >
            + Add
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOperationClick('subtract')}
            disabled={shouldDisableButtons}
          >
            - Subtract
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOperationClick('multiply')}
            disabled={shouldDisableButtons}
          >
            × Multiply
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOperationClick('divide')}
            disabled={shouldDisableButtons}
          >
            ÷ Divide
          </Button>
        </div>

        {/* Result Display */}
        {result !== null && (
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Result: {result}</p>
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div className="text-center p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Validation Status Display */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Status:</p>
          <ul className="list-disc list-inside space-y-1">
            <li
              className={
                firstNumber !== null ? 'text-green-600' : 'text-orange-600'
              }
            >
              First Number: {firstNumber !== null ? '✓ Valid' : '⚠ Required'}
            </li>
            <li
              className={
                secondNumber !== null ? 'text-green-600' : 'text-orange-600'
              }
            >
              Second Number: {secondNumber !== null ? '✓ Valid' : '⚠ Required'}
            </li>
            <li
              className={
                !shouldDisableButtons ? 'text-green-600' : 'text-orange-600'
              }
            >
              Operation Buttons:{' '}
              {!shouldDisableButtons ? '✓ Enabled' : '✗ Disabled'}
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
