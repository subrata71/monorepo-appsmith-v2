/**
 * CalculatorCard - Complete calculator UI widget
 * Combines input fields, operation buttons, and result display in a centered card layout
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { NumberInputField } from '@/entities/calculation/ui/NumberInputField';
import { CalculationResultDisplay } from '@/entities/calculation/ui/CalculationResultDisplay';
import { OperationButtons } from '@/features/calculation/ui/OperationButtons';
import { useCalculationStore } from '@/features/calculation';

/**
 * CalculatorCard widget - Main calculator interface
 * 
 * Features:
 * - Centered card layout with proper spacing
 * - Two number input fields with validation
 * - Four large operation buttons in horizontal layout
 * - Result and error display
 * - Real-time validation and calculation
 * - Full keyboard accessibility support
 */
export function CalculatorCard() {
  // Following Zustand rules - separate selector calls
  const firstNumber = useCalculationStore(state => state.firstNumber);
  const secondNumber = useCalculationStore(state => state.secondNumber);
  const operation = useCalculationStore(state => state.operation);
  const inputErrors = useCalculationStore(state => state.inputErrors);
  const result = useCalculationStore(state => state.result);
  const errorMessage = useCalculationStore(state => state.errorMessage);
  const setFirstNumber = useCalculationStore(state => state.setFirstNumber);
  const setSecondNumber = useCalculationStore(state => state.setSecondNumber);
  const setOperation = useCalculationStore(state => state.setOperation);

  // Determine if operation buttons should be disabled
  const hasInputErrors = Object.keys(inputErrors).length > 0;
  const hasEmptyInputs = firstNumber === null || secondNumber === null;
  const shouldDisableButtons = hasInputErrors || hasEmptyInputs;

  const handleOperationSelect = (selectedOperation: typeof operation) => {
    setOperation(selectedOperation);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold">Simple Calculator</CardTitle>
          <p className="text-muted-foreground">
            Enter two numbers and select an operation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Number Input Fields */}
          <div className="space-y-4">
            <NumberInputField
              value={firstNumber}
              onChange={setFirstNumber}
              label="First Number"
              error={inputErrors.firstNumber}
              placeholder="Enter first number"
            />

            <NumberInputField
              value={secondNumber}
              onChange={setSecondNumber}
              label="Second Number"
              error={inputErrors.secondNumber}
              placeholder="Enter second number"
            />
          </div>

          {/* Operation Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center text-muted-foreground">
              Select Operation
            </p>
            <OperationButtons
              selectedOperation={operation}
              onSelect={handleOperationSelect}
              disabled={shouldDisableButtons}
            />
          </div>

          {/* Result Display */}
          <CalculationResultDisplay
            result={result}
            error={errorMessage}
          />
        </CardContent>
      </Card>
    </div>
  );
}