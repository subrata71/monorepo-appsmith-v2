import React from 'react';
import { useColorPickerStore } from '../model/store';
import type { ColorPickerContainer as ColorPickerContainerType } from '../model/types';

interface ColorPickerContainerProps {
  className?: string;
}

export const ColorPickerContainer = React.memo<ColorPickerContainerProps>(({ className = '' }) => {
  const colorPickerId = useColorPickerStore(state => state.colorPickerId);

  const containerConfig: ColorPickerContainerType = {
    id: colorPickerId,
    role: 'application',
    ariaLabel: 'Interactive color picker area',
    type: 'div'
  };

  return (
    <div
      id={containerConfig.id}
      role={containerConfig.role}
      aria-label={containerConfig.ariaLabel}
      className={`
        w-64 h-64 
        border-2 border-gray-300 
        rounded-lg 
        bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500
        cursor-crosshair
        shadow-lg
        relative
        ${className}
      `.trim()}
      tabIndex={0}
      aria-describedby="color-picker-instructions"
    >
      {/* Interactive area placeholder - will be enhanced with actual color picking functionality */}
      <div className="absolute inset-0 rounded-lg"></div>
      
      {/* Hidden instructions for screen readers */}
      <div id="color-picker-instructions" className="sr-only">
        Color picker container. This area will allow interactive color selection in future updates.
      </div>
    </div>
  );
});

ColorPickerContainer.displayName = 'ColorPickerContainer';