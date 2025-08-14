import React, { useState, useEffect } from 'react';
import { useColorPickerStore } from '../model/store';
import type { ColorSwatch as ColorSwatchType } from '../model/types';

interface ColorSwatchProps {
  className?: string;
}

export const ColorSwatch = React.memo<ColorSwatchProps>(
  ({ className = '' }) => {
    const swatchId = useColorPickerStore(state => state.swatchId);
    const selectedColor = useColorPickerStore(state => state.selectedColor);
    const isTrackingPointer = useColorPickerStore(state => state.isTrackingPointer);
    
    // State for smooth color transitions
    const [displayedColor, setDisplayedColor] = useState(selectedColor);
    const [isAnimating, setIsAnimating] = useState(false);

    // Update displayed color with smooth animation
    useEffect(() => {
      if (selectedColor !== displayedColor) {
        setIsAnimating(true);
        
        // Use a short timeout to create a smooth transition effect
        const timeout = setTimeout(() => {
          setDisplayedColor(selectedColor);
          setIsAnimating(false);
        }, isTrackingPointer ? 50 : 150); // Faster updates while actively selecting
        
        return () => clearTimeout(timeout);
      }
    }, [selectedColor, displayedColor, isTrackingPointer]);

    const swatchConfig: ColorSwatchType = {
      id: swatchId,
      role: 'img',
      ariaLabel: `Current selected color: ${displayedColor}`,
      type: 'div',
      color: displayedColor,
    };

    // Helper function to determine if color is light or dark for better contrast
    const isLightColor = (hexColor: string): boolean => {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      // Calculate relative luminance
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    };

    const isLight = isLightColor(swatchConfig.color);

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Main swatch container with enhanced styling for maximum clarity */}
        <div
          id={swatchConfig.id}
          role={swatchConfig.role}
          aria-label={swatchConfig.ariaLabel}
          tabIndex={0}
          className={`
          w-full h-24 
          border-4 border-gray-200 dark:border-gray-700
          rounded-2xl 
          shadow-2xl
          relative
          overflow-hidden
          transition-all duration-300 ease-out
          cursor-default
          hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]
          hover:scale-[1.03]
          focus:outline-none
          focus:ring-4 focus:ring-blue-500/50
          focus:border-blue-400
          group
          ${isAnimating ? 'animate-pulse' : ''}
          ${isTrackingPointer ? 'duration-75' : 'duration-300'}
        `}
          style={{ 
            backgroundColor: swatchConfig.color,
            transition: `background-color ${isTrackingPointer ? '75ms' : '300ms'} ease-out, transform 300ms ease-out, box-shadow 300ms ease-out`
          }}
        >
          {/* Main color display area */}
          <div
            className={`absolute inset-0 transition-colors ease-out ${isTrackingPointer ? 'duration-75' : 'duration-300'}`}
            style={{ 
              backgroundColor: swatchConfig.color,
              transition: `background-color ${isTrackingPointer ? '75ms' : '300ms'} ease-out`
            }}
          >
            {/* Enhanced checkerboard pattern for better transparency visibility */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%), 
                linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #ccc 75%), 
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
                backgroundSize: '12px 12px',
                backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
              }}
            />
          </div>

          {/* Enhanced color value display with adaptive contrast */}
          <div className="absolute bottom-3 left-3 right-3">
            <div
              className={`
            ${
              isLight
                ? 'bg-gray-900/95 text-white border-gray-700/40'
                : 'bg-white/95 text-gray-900 border-gray-300/40'
            }
            text-sm 
            px-4 py-3 
            rounded-xl 
            font-mono
            text-center
            backdrop-blur-md
            border-2
            shadow-xl
            transition-all duration-300
            group-hover:shadow-2xl
            group-hover:scale-[1.02]
            min-h-[44px]
            flex items-center justify-center
          `}
            >
              <span className="font-bold tracking-wider">
                {swatchConfig.color.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Enhanced definition border with color-adaptive styling */}
          <div
            className={`
          absolute inset-0 
          border-2 
          ${isLight ? 'border-gray-400/40' : 'border-white/40'}
          rounded-2xl
        `}
          />

          {/* Color-adaptive glow effect */}
          <div
            className={`
          absolute inset-0 rounded-2xl 
          ${
            isLight
              ? 'bg-gradient-to-t from-black/10 to-transparent'
              : 'bg-gradient-to-t from-white/10 to-transparent'
          }
        `}
          />

          {/* Focus indicator overlay */}
          <div
            className="
          absolute inset-0 rounded-2xl
          opacity-0 group-focus:opacity-100
          bg-gradient-to-br from-blue-400/20 to-purple-400/20
          transition-opacity duration-300
        "
          />

          {/* Active tracking indicator */}
          {isTrackingPointer && (
            <div className="
              absolute top-2 right-2 
              w-3 h-3 
              bg-white 
              rounded-full 
              shadow-lg 
              animate-pulse
              border-2 border-blue-500
            " />
          )}
        </div>

        {/* Additional accessibility info with live status */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isTrackingPointer 
              ? 'Selecting color...' 
              : 'Click or focus to view color details'
            }
          </p>
          
          {/* Live status indicator for screen readers */}
          <div 
            className="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
          >
            {isTrackingPointer 
              ? `Actively selecting color: ${swatchConfig.color}` 
              : `Selected color: ${swatchConfig.color}`
            }
          </div>
        </div>
      </div>
    );
  }
);

ColorSwatch.displayName = 'ColorSwatch';
