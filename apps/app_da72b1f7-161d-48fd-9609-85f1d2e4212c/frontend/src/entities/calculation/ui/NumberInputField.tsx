/**
 * NumberInputField - Business entity component for validated number input
 * Handles numeric input with real-time validation and error display
 */

import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { NumberInputFieldProps } from '../model/types';

/**
 * Validates numeric input and returns validation result
 */
function validateNumberInput(value: string): { valid: boolean; error?: string; parsedValue: number | null } {
  // Empty input is valid (allows clearing)
  if (value.trim() === '') {
    return { valid: true, parsedValue: null };
  }

  // Check if it's a valid number
  const numericValue = Number(value);
  
  if (isNaN(numericValue)) {
    return { 
      valid: false, 
      error: 'Please enter a valid number',
      parsedValue: null 
    };
  }

  // Check for infinity
  if (!isFinite(numericValue)) {
    return { 
      valid: false, 
      error: 'Number is too large',
      parsedValue: null 
    };
  }

  return { valid: true, parsedValue: numericValue };
}

/**
 * NumberInputField component for validated numeric input
 * 
 * Features:
 * - Real-time validation of numeric input
 * - Clear error messages below the input
 * - Supports null values for empty state
 * - Large, accessible input field
 */
export function NumberInputField({
  value,
  onChange,
  label,
  error,
  placeholder = 'Enter a number'
}: NumberInputFieldProps) {
  const displayValue = value === null ? '' : value.toString();

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const validation = validateNumberInput(inputValue);
    
    // Always update the parent with the parsed value
    onChange(validation.parsedValue);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label}
      </Label>
      
      <Input
        id={label.toLowerCase().replace(/\s+/g, '-')}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        className="h-12 text-lg"
        autoComplete="off"
      />
      
      {error && (
        <p 
          className="text-sm text-destructive mt-1" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}