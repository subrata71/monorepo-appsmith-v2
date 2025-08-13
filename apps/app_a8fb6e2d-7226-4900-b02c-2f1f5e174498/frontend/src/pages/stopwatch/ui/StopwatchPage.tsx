import { Helmet } from 'react-helmet-async';
import { StopwatchPanel } from '@/widgets/stopwatch-panel';

export const StopwatchPage = () => {
  return (
    <>
      <Helmet>
        <title>Stopwatch</title>
      </Helmet>
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <StopwatchPanel />
        </div>
      </main>
    </>
  );
};