import React from 'react';
import { Label } from '@/shared/ui/label';
import { useSmileyStore, COLOR_OPTIONS } from '@/entities/smiley';

export interface ColorControlProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const ColorControl = React.memo<ColorControlProps>(({
  value: controlledValue,
  onChange: controlledOnChange,
  className
}) => {
  const color = useSmileyStore((state) => state.color);
  const setColor = useSmileyStore((state) => state.setColor);

  const currentValue = controlledValue ?? color;
  const handleChange = controlledOnChange ?? setColor;

  return (
    <div className={className}>
      <Label htmlFor="color-control" className="text-sm font-medium text-gray-700">
        Face Color
      </Label>
      <div className="mt-1 grid grid-cols-4 gap-2">
        {COLOR_OPTIONS.map((colorOption) => (
          <button
            key={colorOption}
            type="button"
            onClick={() => handleChange(colorOption)}
            className={`
              w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${currentValue === colorOption ? 'border-gray-900 shadow-md' : 'border-gray-300'}
            `}
            style={{ backgroundColor: colorOption }}
            aria-label={`Select ${colorOption} color`}
            title={colorOption}
          />
        ))}
      </div>
    </div>
  );
});