import React from 'react';
import { Button } from '@/shared/ui';

interface ResetGameProps {
  onReset: () => void;
}

export const ResetGame = React.memo<ResetGameProps>(({ onReset }) => {
  const handleReset = React.useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <Button variant="outline" onClick={handleReset} className="px-6 py-2">
      Reset Game
    </Button>
  );
});
