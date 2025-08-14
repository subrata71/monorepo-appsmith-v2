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
    <div className="relative group">
      {/* Outer container with enhanced visual styling */}
      <div
        id={containerConfig.id}
        role={containerConfig.role}
        aria-label={containerConfig.ariaLabel}
        className={`
          w-72 h-72 
          border-2 border-slate-300 
          rounded-2xl 
          bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500
          cursor-crosshair
          shadow-xl
          relative
          transition-all duration-300 ease-out
          hover:shadow-2xl hover:scale-[1.02]
          focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500
          backdrop-blur-sm
          overflow-hidden
          ${className}
        `.trim()}
        tabIndex={0}
        aria-describedby="color-picker-instructions"
      >
        {/* Subtle texture overlay for better visual depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl"></div>
        
        {/* Interactive crosshair indicator (appears on hover) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/80 transform -translate-x-0.5 shadow-sm"></div>
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/80 transform -translate-y-0.5 shadow-sm"></div>
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/90 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-black/20 shadow-sm"></div>
        </div>
        
        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl border border-white/20"></div>
        
        {/* Hidden instructions for screen readers */}
        <div id="color-picker-instructions" className="sr-only">
          Interactive color picker area. Use keyboard navigation or click to select colors. This area will support full color selection in future updates.
        </div>
      </div>

      {/* Floating label for better context */}
      <div className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md border border-gray-200">
        Color Picker
      </div>
    </div>
  );
});

ColorPickerContainer.displayName = 'ColorPickerContainer';