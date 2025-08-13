import { Helmet } from 'react-helmet-async';
import { RouletteSection } from '@/widgets/roulette-section';

export function RoulettePage() {
  return (
    <>
      <Helmet>
        <title>Roulette Wheel | Roulette App</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <RouletteSection />
      </div>
    </>
  );
}
