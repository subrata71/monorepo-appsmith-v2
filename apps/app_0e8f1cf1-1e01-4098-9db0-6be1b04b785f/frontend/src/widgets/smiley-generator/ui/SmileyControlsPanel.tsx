import React from 'react';
import { MouthControl, EyeControl, ColorControl } from '@/features/smiley-controls';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export interface SmileyControlsPanelProps {
  className?: string;
}

export const SmileyControlsPanel = React.memo<SmileyControlsPanelProps>(({
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Customize Your Smiley
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MouthControl />
        <EyeControl />
        <ColorControl />
      </CardContent>
    </Card>
  );
});