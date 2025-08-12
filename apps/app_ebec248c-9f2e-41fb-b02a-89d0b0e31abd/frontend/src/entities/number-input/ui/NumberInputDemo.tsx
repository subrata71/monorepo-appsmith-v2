import React from 'react';
import { NumberInputField } from './NumberInputField';
import { validateNumberInput } from '../lib/validation';

export const NumberInputDemo = React.memo(() => {
  const [firstNumber, setFirstNumber] = React.useState('');
  const [secondNumber, setSecondNumber] = React.useState('');
  const [firstNumberError, setFirstNumberError] = React.useState<
    string | undefined
  >();
  const [secondNumberError, setSecondNumberError] = React.useState<
    string | undefined
  >();

  const handleFirstNumberChange = React.useCallback((value: string) => {
    setFirstNumber(value);
    const validation = validateNumberInput(value);
    setFirstNumberError(validation.error);
  }, []);

  const handleSecondNumberChange = React.useCallback((value: string) => {
    setSecondNumber(value);
    const validation = validateNumberInput(value);
    setSecondNumberError(validation.error);
  }, []);

  const isValid = React.useMemo(() => {
    return (
      validateNumberInput(firstNumber).isValid &&
      validateNumberInput(secondNumber).isValid
    );
  }, [firstNumber, secondNumber]);

  const sum = React.useMemo(() => {
    if (isValid) {
      return Number(firstNumber) + Number(secondNumber);
    }
    return null;
  }, [firstNumber, secondNumber, isValid]);

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Number Input Demo</h2>

      <NumberInputField
        label="First Number"
        value={firstNumber}
        onChange={handleFirstNumberChange}
        error={firstNumberError}
      />

      <NumberInputField
        label="Second Number"
        value={secondNumber}
        onChange={handleSecondNumberChange}
        error={secondNumberError}
      />

      {isValid && sum !== null && (
        <div className="p-4 bg-muted rounded-md">
          <span className="font-medium">Result: {sum}</span>
        </div>
      )}
    </div>
  );
});
