import React from 'react';
import { ArrayInputField } from '@/features/array-input';
import { RandomArrayGenerator } from '@/features/random-array-generator';
import { Separator } from '@/shared/ui';

export const ArrayInputSection = React.memo(() => {
  return (
    <div className="space-y-6">
      <ArrayInputField />

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <RandomArrayGenerator />
    </div>
  );
});
