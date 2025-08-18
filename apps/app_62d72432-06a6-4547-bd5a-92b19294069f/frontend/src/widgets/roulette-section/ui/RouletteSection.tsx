import { memo } from 'react';
import { RouletteWheel, useRouletteStore } from '@/entities/roulette';
import { SpinControl, ResultDisplay } from '@/features';

export const RouletteSection = memo(() => {
  const isSpinning = useRouletteStore(state => state.isSpinning);
  const winningNumber = useRouletteStore(state => state.winningNumber);
  const slots = useRouletteStore(state => state.slots);

  return (
    <section className="w-full flex flex-col items-center justify-center space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Roulette Wheel</h1>
        <p className="text-lg text-gray-600">
          Interactive roulette wheel prototype
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <RouletteWheel
          slots={slots}
          highlightedSlot={winningNumber}
          isSpinning={isSpinning}
          className="shadow-2xl rounded-full"
        />

        <SpinControl />

        <ResultDisplay />
      </div>
    </section>
  );
});
