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
import { MOUTH_OPTIONS, type MouthType } from '@/entities/smiley';

export interface MouthControlProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const MouthControl = React.memo<MouthControlProps>(
  ({ value: controlledValue, onChange: controlledOnChange, className }) => {
    const mouth = useSmileyStore(state => state.mouth);
    const setMouth = useSmileyStore(state => state.setMouth);

    const currentValue = controlledValue ?? mouth;
    const handleChange = controlledOnChange ?? setMouth;

    const mouthOptions = Object.keys(MOUTH_OPTIONS) as MouthType[];

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
          htmlFor="mouth-control"
          className="text-sm font-medium text-gray-700"
        >
          Mouth Style
        </Label>
        <Select value={currentValue} onValueChange={handleChange}>
          <SelectTrigger id="mouth-control" className="mt-1">
            <SelectValue placeholder="Select mouth style" />
          </SelectTrigger>
          <SelectContent>
            {mouthOptions.map(option => (
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
