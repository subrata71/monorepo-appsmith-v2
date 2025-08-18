import React from 'react';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useSmileyStore } from '@/entities/smiley';
import { EYE_OPTIONS, type EyeType } from '@/entities/smiley';

export interface EyeControlProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const EyeControl = React.memo<EyeControlProps>(
  ({ value: controlledValue, onChange: controlledOnChange, className }) => {
    const eyes = useSmileyStore(state => state.eyes);
    const setEyes = useSmileyStore(state => state.setEyes);

    const currentValue = controlledValue ?? eyes;
    const handleChange = controlledOnChange ?? setEyes;

    const eyeOptions = Object.keys(EYE_OPTIONS) as EyeType[];

    // Format option labels
    const formatLabel = (option: string) => {
      return option
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return (
      <div className={className}>
        <Label
          htmlFor="eye-control"
          className="text-sm font-medium text-gray-700"
        >
          Eye Style
        </Label>
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger id="eye-control" className="mt-1">
            <SelectValue placeholder="Select eye style" />
          </SelectTrigger>
          <SelectContent>
            {eyeOptions.map(option => (
              <SelectItem key={option} value={option}>
                {formatLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
