import React from 'react';
import { ColorPickerContainer, ColorSwatch } from '@/entities/color-picker';
import { Container } from '@/shared';

interface ColorPickerWidgetProps {
  colorPickerId?: string;
  swatchId?: string;
  className?: string;
}

export const ColorPickerWidget = React.memo<ColorPickerWidgetProps>(({ 
  className = '' 
}) => {
  return (
    <Container className={`max-w-2xl ${className}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Color Picker</h1>
          <p className="text-gray-600">
            Interactive color selection tool with visual feedback
          </p>
        </div>

        {/* Main Color Picker Area */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Color Picker Container */}
            <div className="flex-1 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Color Selection Area
              </h2>
              <div className="flex justify-center">
                <ColorPickerContainer />
              </div>
            </div>

            {/* Color Swatch Display */}
            <div className="flex-1 lg:max-w-xs">
              <ColorSwatch />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            How to Use
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• The color picker area above will support interactive color selection</li>
            <li>• Selected colors will be displayed in the color swatch</li>
            <li>• Color values are shown in hexadecimal format</li>
            <li>• This interface is designed to be accessible and responsive</li>
          </ul>
        </div>
      </div>
    </Container>
  );
});

ColorPickerWidget.displayName = 'ColorPickerWidget';