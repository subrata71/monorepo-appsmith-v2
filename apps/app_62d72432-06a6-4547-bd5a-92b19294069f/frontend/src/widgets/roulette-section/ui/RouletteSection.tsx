import { memo } from 'react';
import { RouletteWheel } from '@/entities/roulette';
import type { RouletteSlotType } from '@/entities/roulette';

interface RouletteSectionProps {
  slots?: RouletteSlotType[];
  highlightedSlot?: number | null;
  isSpinning?: boolean;
  children?: React.ReactNode;
}

export const RouletteSection = memo<RouletteSectionProps>(
  ({ slots, highlightedSlot, isSpinning = false, children }) => {
    return (
      <section className="w-full flex flex-col items-center justify-center space-y-8 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Roulette Wheel</h1>
          <p className="text-lg text-gray-600">
            Interactive roulette wheel prototype
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <RouletteWheel
            slots={slots}
            highlightedSlot={highlightedSlot}
            isSpinning={isSpinning}
            className="shadow-2xl rounded-full"
          />

          {children && (
            <div className="flex flex-col items-center space-y-4">
              {children}
            </div>
          )}
        </div>
      </section>
    );
  }
);
