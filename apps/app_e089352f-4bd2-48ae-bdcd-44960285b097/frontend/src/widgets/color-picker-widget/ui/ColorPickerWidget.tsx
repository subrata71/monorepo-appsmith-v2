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
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Color Picker Container */}
            <div className="flex-1 flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Interactive Color Selection
                </h2>
                <p className="text-sm text-gray-600 max-w-sm">
                  Click or hover over the color wheel to explore different colors
                </p>
              </div>
              <div className="flex justify-center">
                <ColorPickerContainer />
              </div>
            </div>

            {/* Visual Separator */}
            <div className="hidden lg:block w-px h-80 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Color Swatch Display */}
            <div className="flex-1 lg:max-w-sm flex flex-col items-center space-y-6">
              <div className="text-center lg:text-left w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Selected Color Preview
                </h2>
                <p className="text-sm text-gray-600">
                  Live preview of your color selection with hex value
                </p>
              </div>
              <div className="w-full max-w-xs">
                <ColorSwatch />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-blue-800 mb-3">
                Using the Color Picker
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Hover over the color picker to see interactive crosshairs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Selected colors are displayed with live preview in the swatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Color values are shown in hexadecimal format for easy copying</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Fully accessible with keyboard navigation and screen reader support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
});

ColorPickerWidget.displayName = 'ColorPickerWidget';