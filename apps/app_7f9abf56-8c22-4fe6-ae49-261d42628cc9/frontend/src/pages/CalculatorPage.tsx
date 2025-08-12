/**
 * CalculatorPage - Main calculator page
 * Provides the primary calculator interface using the CalculatorCard widget
 */

import React from 'react';
import { CalculatorCard } from '@/widgets/CalculatorCard';

/**
 * Calculator page component
 *
 * Features:
 * - Single-purpose page for calculator functionality
 * - Centered layout with proper padding
 * - Uses the complete CalculatorCard widget
 * - Responsive design with mobile-friendly spacing
 */
export const CalculatorPage = React.memo(() => {
  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full">
        <CalculatorCard />
      </div>
    </main>
  );
});