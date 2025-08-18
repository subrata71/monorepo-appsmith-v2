/**
 * CalculatorCard - Complete calculator UI widget
 * Combines input fields, Add button, and result display in a centered card layout
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { NumberInputField } from '@/entities/calculation/ui/NumberInputField';
import { CalculationResultDisplay } from '@/entities/calculation/ui/CalculationResultDisplay';
import { useCalculationStore } from '@/features/calculation';

/**
 * CalculatorCard widget - Simple addition calculator interface
 *
 * Features:
 * - Centered card layout with proper spacing
 * - Two number input fields with validation
 * - Large Add button for performing addition
 * - Result and error display
 * - Real-time validation and calculation
 * - Full keyboard accessibility support
 */
export function CalculatorCard() {
  // Following Zustand rules - separate selector calls
  const firstNumber = useCalculationStore(state => state.firstNumber);
  const secondNumber = useCalculationStore(state => state.secondNumber);
  const inputErrors = useCalculationStore(state => state.inputErrors);
  const result = useCalculationStore(state => state.result);
  const errorMessage = useCalculationStore(state => state.errorMessage);
  const setFirstNumber = useCalculationStore(state => state.setFirstNumber);
  const setSecondNumber = useCalculationStore(state => state.setSecondNumber);
  const setOperation = useCalculationStore(state => state.setOperation);
  const calculate = useCalculationStore(state => state.calculate);

  // Determine if Add button should be disabled
  const hasInputErrors = Object.keys(inputErrors).length > 0;
  const hasEmptyInputs = firstNumber === null || secondNumber === null;
  const shouldDisableAddButton = hasInputErrors || hasEmptyInputs;

  const handleAddClick = () => {
    // Set operation to 'add' and trigger calculation
    setOperation('add');
    calculate();
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold">
            Simple Calculator
          </CardTitle>
          <p className="text-muted-foreground">
            Enter two numbers for addition
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

          {/* Add Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleAddClick}
              disabled={shouldDisableAddButton}
              className="w-full max-w-xs h-14 text-xl font-semibold"
              aria-label="Add the two numbers"
            >
              Add
            </Button>
          </div>

          {/* Result Display */}
          <CalculationResultDisplay result={result} error={errorMessage} />
        </CardContent>
      </Card>
    </div>
  );
}
