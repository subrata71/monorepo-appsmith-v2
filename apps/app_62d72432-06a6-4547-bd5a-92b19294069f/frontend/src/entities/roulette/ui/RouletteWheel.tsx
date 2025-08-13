import { memo, useMemo } from 'react';
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

    const wheelRotation = useMemo(() => {
      return isSpinning ? 'animate-spin' : '';
    }, [isSpinning]);

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className={`${wheelRotation} transition-all duration-300`}
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
