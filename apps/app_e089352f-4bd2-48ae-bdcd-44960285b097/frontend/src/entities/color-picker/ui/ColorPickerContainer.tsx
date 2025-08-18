import React, { useCallback, useRef, useEffect } from 'react';
import { useColorPickerStore } from '../model/store';
import type { ColorPickerContainer as ColorPickerContainerType } from '../model/types';

interface ColorPickerContainerProps {
  className?: string;
}

export const ColorPickerContainer = React.memo<ColorPickerContainerProps>(
  ({ className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const colorPickerId = useColorPickerStore(state => state.colorPickerId);
    const isTrackingPointer = useColorPickerStore(
      state => state.isTrackingPointer
    );
    const startPointerTracking = useColorPickerStore(
      state => state.startPointerTracking
    );
    const updatePointerPosition = useColorPickerStore(
      state => state.updatePointerPosition
    );
    const stopPointerTracking = useColorPickerStore(
      state => state.stopPointerTracking
    );
    const calculateColorFromPosition = useColorPickerStore(
      state => state.calculateColorFromPosition
    );

    const containerConfig: ColorPickerContainerType = {
      id: colorPickerId,
      role: 'application',
      ariaLabel: 'Interactive color picker area',
      type: 'div',
    };

    // Get relative position within the container
    const getRelativePosition = useCallback(
      (clientX: number, clientY: number) => {
        if (!containerRef.current) return { x: 0, y: 0 };

        const rect = containerRef.current.getBoundingClientRect();
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      },
      []
    );

    // Handle pointer down (mouse/touch start)
    const handlePointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        const position = getRelativePosition(event.clientX, event.clientY);

        if (containerRef.current) {
          const containerSize = {
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
          };

          startPointerTracking(position);
          calculateColorFromPosition(position, containerSize);
        }
      },
      [startPointerTracking, calculateColorFromPosition, getRelativePosition]
    );

    // Handle pointer move (mouse/touch move)
    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isTrackingPointer || !containerRef.current) return;

        event.preventDefault();
        const position = getRelativePosition(event.clientX, event.clientY);
        const containerSize = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };

        updatePointerPosition(position);
        calculateColorFromPosition(position, containerSize);
      },
      [
        isTrackingPointer,
        updatePointerPosition,
        calculateColorFromPosition,
        getRelativePosition,
      ]
    );

    // Handle pointer up (mouse/touch end)
    const handlePointerUp = useCallback(() => {
      stopPointerTracking();
    }, [stopPointerTracking]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const step = event.shiftKey ? 10 : 1; // Larger steps with Shift key
        const containerSize = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };

        let newX = containerSize.width * 0.5; // Default to center
        let newY = containerSize.height * 0.5;

        // Get current position or default to center
        const currentPosition = useColorPickerStore.getState().pickerPosition;
        if (currentPosition) {
          newX = currentPosition.x;
          newY = currentPosition.y;
        }

        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            newX = Math.max(0, newX - step);
            break;
          case 'ArrowRight':
            event.preventDefault();
            newX = Math.min(containerSize.width, newX + step);
            break;
          case 'ArrowUp':
            event.preventDefault();
            newY = Math.max(0, newY - step);
            break;
          case 'ArrowDown':
            event.preventDefault();
            newY = Math.min(containerSize.height, newY + step);
            break;
          case 'Home':
            event.preventDefault();
            newX = 0;
            newY = 0;
            break;
          case 'End':
            event.preventDefault();
            newX = containerSize.width;
            newY = containerSize.height;
            break;
          default:
            return; // Don't handle other keys
        }

        const position = { x: newX, y: newY };
        updatePointerPosition(position);
        calculateColorFromPosition(position, containerSize);
      },
      [updatePointerPosition, calculateColorFromPosition]
    );

    // Global pointer up handler to stop tracking even when pointer leaves container
    useEffect(() => {
      const handleGlobalPointerUp = () => {
        if (isTrackingPointer) {
          stopPointerTracking();
        }
      };

      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointercancel', handleGlobalPointerUp);

      return () => {
        document.removeEventListener('pointerup', handleGlobalPointerUp);
        document.removeEventListener('pointercancel', handleGlobalPointerUp);
      };
    }, [isTrackingPointer, stopPointerTracking]);

    return (
      <div className="relative group">
        {/* Outer container with enhanced visual styling */}
        <div
          ref={containerRef}
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
          touch-none
          select-none
          ${isTrackingPointer ? 'cursor-grabbing' : 'cursor-crosshair'}
          ${className}
        `.trim()}
          tabIndex={0}
          aria-describedby="color-picker-instructions"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
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
            Interactive color picker area. Click and drag or use keyboard
            navigation to select colors. Use arrow keys to adjust color
            position, Shift + arrow keys for larger steps. Press Home for
            top-left corner, End for bottom-right corner. Selected color updates
            in real-time in the swatch below.
          </div>
        </div>

        {/* Floating label for better context */}
        <div className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md border border-gray-200">
          Color Picker
        </div>
      </div>
    );
  }
);

ColorPickerContainer.displayName = 'ColorPickerContainer';
