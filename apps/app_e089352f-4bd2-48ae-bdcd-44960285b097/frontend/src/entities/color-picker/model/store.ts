import { create } from 'zustand';
import type { ColorPickerState, PickerPosition } from './types';

interface ColorPickerStore extends ColorPickerState {
  setSelectedColor: (color: string) => void;
  startPointerTracking: (position: PickerPosition) => void;
  updatePointerPosition: (position: PickerPosition) => void;
  stopPointerTracking: () => void;
  calculateColorFromPosition: (position: PickerPosition, containerSize: { width: number; height: number }) => string;
}

// Helper function to convert HSV to RGB
const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
};

// Helper function to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const useColorPickerStore = create<ColorPickerStore>((set, get) => ({
  colorPickerId: 'color-picker-container',
  swatchId: 'color-swatch-display',
  selectedColor: '#3b82f6',
  isTrackingPointer: false,
  pickerPosition: { x: 0.5, y: 0.5 },
  
  setSelectedColor: (color: string) => set({ selectedColor: color }),
  
  startPointerTracking: (position: PickerPosition) => 
    set({ 
      isTrackingPointer: true, 
      pickerPosition: position 
    }),
  
  updatePointerPosition: (position: PickerPosition) => {
    const state = get();
    if (state.isTrackingPointer) {
      set({ pickerPosition: position });
    }
  },
  
  stopPointerTracking: () => 
    set({ isTrackingPointer: false }),
  
  calculateColorFromPosition: (position: PickerPosition, containerSize: { width: number; height: number }) => {
    // Normalize position to [0,1] range
    const normalizedX = Math.max(0, Math.min(1, position.x / containerSize.width));
    const normalizedY = Math.max(0, Math.min(1, position.y / containerSize.height));
    
    // Convert position to HSV
    // x-axis represents hue (0-360 degrees)
    // y-axis represents saturation/value combination
    const hue = normalizedX * 360;
    const saturation = 1 - normalizedY; // Top = full saturation, bottom = no saturation
    const value = 0.4 + (normalizedY * 0.6); // Ensure minimum brightness
    
    // Convert HSV to RGB
    const [r, g, b] = hsvToRgb(hue, saturation, value);
    
    // Convert RGB to HEX
    const hexColor = rgbToHex(r, g, b);
    
    // Update the selected color
    set({ selectedColor: hexColor });
    
    return hexColor;
  },
}));
