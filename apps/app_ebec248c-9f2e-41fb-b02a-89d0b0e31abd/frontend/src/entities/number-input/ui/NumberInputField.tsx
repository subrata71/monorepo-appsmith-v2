import React from 'react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { NumberInputFieldProps } from '../model/types';

export const NumberInputField = React.memo<NumberInputFieldProps>(
  ({ value, onChange, label, error }) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <div className="space-y-2">
        <Label
          htmlFor={`number-input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {label}
        </Label>
        <Input
          id={`number-input-${label.toLowerCase().replace(/\s+/g, '-')}`}
          type="number"
          value={value}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${label.toLowerCase().replace(/\s+/g, '-')}-error`
              : undefined
          }
          placeholder="Enter a number"
        />
        {error && (
          <div
            id={`${label.toLowerCase().replace(/\s+/g, '-')}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);
