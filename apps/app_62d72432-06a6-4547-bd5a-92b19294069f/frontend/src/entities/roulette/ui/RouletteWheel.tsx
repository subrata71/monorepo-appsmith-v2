import { memo, useMemo, useState, useEffect } from 'react';
import { RouletteSlot } from './RouletteSlot';
import { ROULETTE_SLOTS } from '../model/types';
import type { RouletteSlot as RouletteSlotType } from '../model/types';

interface RouletteWheelProps {
  slots?: RouletteSlotType[];
  highlightedSlot?: number | null;
  isSpinning?: boolean;
  className?: string;
}

export const RouletteWheel = memo<RouletteWheelProps>(
  ({
    slots = ROULETTE_SLOTS,
    highlightedSlot = null,
    isSpinning = false,
    className = '',
  }) => {
    const radius = 160;
    const centerX = 200;
    const centerY = 200;
    const [rotation, setRotation] = useState(0);
    const [previousWinningSlot, setPreviousWinningSlot] = useState<number | null>(null);

    // Calculate final rotation when winning slot changes
    const finalRotation = useMemo(() => {
      if (highlightedSlot === null || highlightedSlot === previousWinningSlot) return rotation;
      
      // Find the index of the winning slot
      const winningIndex = slots.findIndex(slot => slot.number === highlightedSlot);
      if (winningIndex === -1) return rotation;
      
      // Calculate the angle for this slot (accounting for the pointer at top)
      const slotAngle = (360 / slots.length) * winningIndex;
      // Add multiple full rotations for visual effect (3-5 full spins)
      const fullRotations = 3 + Math.random() * 2;
      const totalRotation = rotation + (fullRotations * 360) + (360 - slotAngle);
      
      return totalRotation;
    }, [highlightedSlot, slots, rotation, previousWinningSlot]);

    // Handle spinning animation
    useEffect(() => {
      if (isSpinning && highlightedSlot === null) {
        // Start spinning - continuous rotation
        setRotation(prev => prev + 1800); // 5 full rotations for effect
      } else if (!isSpinning && highlightedSlot !== null && highlightedSlot !== previousWinningSlot) {
        // Spin completed - animate to final position
        setRotation(finalRotation);
        setPreviousWinningSlot(highlightedSlot);
      }
    }, [isSpinning, highlightedSlot, finalRotation, previousWinningSlot]);

    const wheelStyle = useMemo(() => {
      if (isSpinning && highlightedSlot === null) {
        // Fast initial spin
        return {
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 2s linear',
        };
      } else if (!isSpinning && highlightedSlot !== null) {
        // Slow down to final position
        return {
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        };
      }
      return {
        transform: `rotate(${rotation}deg)`,
        transition: 'none',
      };
    }, [isSpinning, highlightedSlot, rotation]);

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            style={wheelStyle}
          >
            {/* Outer rim */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 10}
              fill="#8b4513"
              stroke="#654321"
              strokeWidth="4"
            />

            {/* Main wheel background */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#f5f5f5"
              stroke="#666"
              strokeWidth="2"
            />

            {/* Render all slots */}
            {slots.map((slot, index) => (
              <RouletteSlot
                key={`slot-${slot.number}`}
                slot={slot}
                index={index}
                totalSlots={slots.length}
                highlighted={highlightedSlot === slot.number}
                radius={radius}
              />
            ))}

            {/* Center hub */}
            <circle
              cx={centerX}
              cy={centerY}
              r={30}
              fill="#ffd700"
              stroke="#b8860b"
              strokeWidth="3"
            />

            {/* Center point */}
            <circle cx={centerX} cy={centerY} r={5} fill="#8b4513" />
          </svg>

          {/* Pointer/Ball indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-500 z-10" />
        </div>
      </div>
    );
  }
);
