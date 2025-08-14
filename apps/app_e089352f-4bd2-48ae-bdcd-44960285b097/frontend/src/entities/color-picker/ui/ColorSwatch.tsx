import React from 'react';
import { useColorPickerStore } from '../model/store';
import type { ColorSwatch as ColorSwatchType } from '../model/types';

interface ColorSwatchProps {
  className?: string;
}

export const ColorSwatch = React.memo<ColorSwatchProps>(({ className = '' }) => {
  const swatchId = useColorPickerStore(state => state.swatchId);
  const selectedColor = useColorPickerStore(state => state.selectedColor);

  const swatchConfig: ColorSwatchType = {
    id: swatchId,
    role: 'img',
    ariaLabel: `Current selected color: ${selectedColor}`,
    type: 'div',
    color: selectedColor
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">Selected Color</h3>
      <div
        id={swatchConfig.id}
        role={swatchConfig.role}
        aria-label={swatchConfig.ariaLabel}
        className="
          w-full h-16 
          border-2 border-gray-300 
          rounded-lg 
          shadow-inner
          relative
          overflow-hidden
        "
        style={{ backgroundColor: swatchConfig.color }}
      >
        {/* Color display area */}
        <div className="absolute inset-0 bg-current"></div>
        
        {/* Color value display */}
        <div className="absolute bottom-1 left-1 right-1">
          <div className="
            bg-black bg-opacity-75 
            text-white text-xs 
            px-2 py-1 
            rounded 
            font-mono
            text-center
          ">
            {swatchConfig.color.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
});

ColorSwatch.displayName = 'ColorSwatch';