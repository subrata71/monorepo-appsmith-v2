import React from 'react';
import { RandomizeButton } from '@/features/smiley-randomizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export interface SmileyRandomizerSectionProps {
  className?: string;
}

export const SmileyRandomizerSection = React.memo<SmileyRandomizerSectionProps>(
  ({ className }) => {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Feeling Lucky?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to randomize all smiley features at once!
            </p>
            <RandomizeButton />
          </div>
        </CardContent>
      </Card>
    );
  }
);
