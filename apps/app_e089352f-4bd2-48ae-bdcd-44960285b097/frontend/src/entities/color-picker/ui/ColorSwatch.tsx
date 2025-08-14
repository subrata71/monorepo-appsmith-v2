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
    <div className={`space-y-4 ${className}`}>
      <div
        id={swatchConfig.id}
        role={swatchConfig.role}
        aria-label={swatchConfig.ariaLabel}
        className="
          w-full h-20 
          border-2 border-slate-300 
          rounded-xl 
          shadow-lg
          relative
          overflow-hidden
          transition-all duration-300 ease-in-out
          cursor-default
          hover:shadow-xl hover:scale-[1.02]
          group
        "
        style={{ backgroundColor: swatchConfig.color }}
      >
        {/* Color display area with subtle pattern for better visibility */}
        <div className="absolute inset-0" style={{ backgroundColor: swatchConfig.color }}>
          {/* Checkerboard pattern for transparency indicator */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #000 25%, transparent 25%), 
                linear-gradient(-45deg, #000 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #000 75%), 
                linear-gradient(-45deg, transparent 75%, #000 75%)
              `,
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
            }}
          />
        </div>
        
        {/* Color value display with improved contrast */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="
            bg-black/90 
            text-white text-sm 
            px-3 py-2 
            rounded-lg 
            font-mono
            text-center
            backdrop-blur-sm
            border border-white/20
            shadow-lg
            transition-all duration-300
            group-hover:bg-black/95
          ">
            {swatchConfig.color.toUpperCase()}
          </div>
        </div>
        
        {/* Subtle inner border for definition */}
        <div className="absolute inset-0 border border-white/30 rounded-xl"></div>
        
        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>
    </div>
  );
});

ColorSwatch.displayName = 'ColorSwatch';