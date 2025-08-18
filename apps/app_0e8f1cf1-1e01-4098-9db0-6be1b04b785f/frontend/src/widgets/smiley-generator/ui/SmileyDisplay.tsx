import React from 'react';
import { SmileyFace, useSmileyStore } from '@/entities/smiley';
import { Card, CardContent } from '@/shared/ui/card';

export interface SmileyDisplayProps {
  size?: number;
  className?: string;
}

export const SmileyDisplay = React.memo<SmileyDisplayProps>(
  ({ size = 200, className }) => {
    const mouth = useSmileyStore(state => state.mouth);
    const eyes = useSmileyStore(state => state.eyes);
    const color = useSmileyStore(state => state.color);

    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <SmileyFace mouth={mouth} eyes={eyes} color={color} size={size} />
        </CardContent>
      </Card>
    );
  }
);
