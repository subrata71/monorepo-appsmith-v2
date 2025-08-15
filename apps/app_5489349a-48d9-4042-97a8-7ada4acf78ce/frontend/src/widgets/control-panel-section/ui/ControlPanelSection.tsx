import React from 'react';
import { ControlPanel } from '@/features/control-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';

export const ControlPanelSection = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualization Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <ControlPanel />
      </CardContent>
    </Card>
  );
});