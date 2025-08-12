/**
 * CalculatorCard - Complete calculator UI widget
 * Combines two number input fields in a centered card layout
 */

import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { NumberInputField } from '@/entities/calculation';
import { useCalculationStore } from '@/features/calculation';

/**
 * CalculatorCard widget - Main calculator interface
 *
 * Features:
 * - Centered card layout with proper spacing
 * - Two number input fields with validation
 * - Real-time validation and state management
 * - Full keyboard accessibility support
 */
export const CalculatorCard = React.memo(() => {
  // Following Zustand rules - separate selector calls with useCallback for selectors
  const firstNumber = useCalculationStore(useCallback((state) => state.firstNumber, []));
  const secondNumber = useCalculationStore(useCallback((state) => state.secondNumber, []));
  const inputErrors = useCalculationStore(useCallback((state) => state.inputErrors, []));
  
  // Use useCallback for the action functions
  const setFirstNumber = useCalculationStore(useCallback((state) => state.setFirstNumber, []));
  const setSecondNumber = useCalculationStore(useCallback((state) => state.setSecondNumber, []));
  
  const handleFirstNumberChange = useCallback((value: number | null) => {
    setFirstNumber(value);
  }, [setFirstNumber]);
  
  const handleSecondNumberChange = useCallback((value: number | null) => {
    setSecondNumber(value);
  }, [setSecondNumber]);

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold">
            Simple Calculator
          </CardTitle>
          <p className="text-muted-foreground">
            Enter two numbers for calculation
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Number Input Fields */}
          <div className="space-y-4">
            <NumberInputField
              value={firstNumber}
              onChange={handleFirstNumberChange}
              label="First Number"
              error={inputErrors.firstNumber}
              placeholder="Enter first number"
            />

            <NumberInputField
              value={secondNumber}
              onChange={handleSecondNumberChange}
              label="Second Number"
              error={inputErrors.secondNumber}
              placeholder="Enter second number"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});