import React from 'react';
import { NumberInputField } from '@/entities/number-input';
import { useSumCalculatorStore } from '@/entities/sum-calculator';
import { SumButton } from './SumButton';

/**
 * Demo component showing the Sum Button in action with two NumberInputField components
 * This demonstrates the complete sum calculation workflow
 */
export const SumButtonDemo = React.memo(() => {
  // Using individual selectors as per Zustand guidelines
  const firstNumber = useSumCalculatorStore(state => state.firstNumber);
  const secondNumber = useSumCalculatorStore(state => state.secondNumber);
  const firstNumberError = useSumCalculatorStore(
    state => state.firstNumberError
  );
  const secondNumberError = useSumCalculatorStore(
    state => state.secondNumberError
  );
  const result = useSumCalculatorStore(state => state.result);

  const setFirstNumber = useSumCalculatorStore(state => state.setFirstNumber);
  const setSecondNumber = useSumCalculatorStore(state => state.setSecondNumber);

  return (
    <div className="space-y-6 max-w-md mx-auto p-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sum Calculator Demo</h2>
        <p className="text-muted-foreground mb-6">
          Enter two numbers and click Sum to calculate their total.
        </p>
      </div>

      <div className="space-y-4">
        <NumberInputField
          value={firstNumber}
          onChange={setFirstNumber}
          label="First Number"
          error={firstNumberError}
        />

        <NumberInputField
          value={secondNumber}
          onChange={setSecondNumber}
          label="Second Number"
          error={secondNumberError}
        />

        <div className="flex justify-center">
          <SumButton />
        </div>

        {result !== null && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-lg font-medium">
              Result: <span className="text-primary font-bold">{result}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

SumButtonDemo.displayName = 'SumButtonDemo';
