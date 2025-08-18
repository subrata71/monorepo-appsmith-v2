import React from 'react';
import { NeonText } from '@/shared/ui';

export const ControlsHintWidget = React.memo(() => {
  return (
    <div className="flex justify-center p-4">
      <div className="bg-black/60 rounded-lg border border-cyan-400/30 p-4 text-center">
        <NeonText text="CONTROLS" size="sm" className="mb-2" />
        <div className="space-y-1">
          <NeonText
            text="← → Arrow Keys or A/D to move paddle"
            size="sm"
            color="#80ff80"
          />
          <NeonText
            text="Mouse movement to control paddle"
            size="sm"
            color="#80ff80"
          />
        </div>
      </div>
    </div>
  );
});
