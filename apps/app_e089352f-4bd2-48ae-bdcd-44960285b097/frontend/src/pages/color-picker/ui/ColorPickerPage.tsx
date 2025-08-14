import React from 'react';
import { ColorPickerWidget } from '@/widgets/color-picker-widget';

export const ColorPickerPage = React.memo(() => {
  return <ColorPickerWidget />;
});

ColorPickerPage.displayName = 'ColorPickerPage';