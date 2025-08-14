import { create } from 'zustand';
import type { ColorPickerState, PickerPosition } from './types';

interface ColorPickerStore extends ColorPickerState {
  setSelectedColor: (color: string) => void;
  startPointerTracking: (position: PickerPosition) => void;
  updatePointerPosition: (position: PickerPosition) => void;
  stopPointerTracking: () => void;
  calculateColorFromPosition: (position: PickerPosition, containerSize: { width: number; height: number }) => string;
  getColorLuminance: (color: string) => number;
  isColorLight: (color: string) => boolean;
}

// Enhanced HSV to RGB conversion with improved precision
const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  // Normalize hue to [0, 360] range
  h = ((h % 360) + 360) % 360;
  
  // Clamp saturation and value to [0, 1] range
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));
  
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

// Enhanced RGB to HEX conversion with validation
const rgbToHex = (r: number, g: number, b: number): string => {
  // Clamp RGB values to [0, 255] range
  const clampedR = Math.max(0, Math.min(255, Math.round(r)));
  const clampedG = Math.max(0, Math.min(255, Math.round(g)));
  const clampedB = Math.max(0, Math.min(255, Math.round(b)));
  
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(clampedR)}${toHex(clampedG)}${toHex(clampedB)}`;
};

// Helper function to calculate relative luminance for color analysis
const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const normalize = (c: number) => {
    const normalized = c / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  
  const rs = normalize(r);
  const gs = normalize(g);
  const bs = normalize(b);
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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
    // Validate inputs to prevent errors
    if (!position || !containerSize || containerSize.width <= 0 || containerSize.height <= 0) {
      return get().selectedColor; // Return current color if invalid inputs
    }
    
    // Enhanced position normalization with precise bounds checking
    const normalizedX = Math.max(0, Math.min(1, position.x / containerSize.width));
    const normalizedY = Math.max(0, Math.min(1, position.y / containerSize.height));
    
    // Enhanced HSV calculation for improved color distribution
    // x-axis represents hue (0-360 degrees) with smooth distribution
    const hue = normalizedX * 360;
    
    // Enhanced y-axis mapping for better saturation/value balance
    // Top area (low normalizedY) = high saturation, bright colors
    // Bottom area (high normalizedY) = lower saturation, muted colors
    // Using power curves for more intuitive color selection
    const saturation = Math.pow(1 - normalizedY, 0.8); // Slight curve for better color distribution
    const value = 0.25 + (0.75 * Math.pow(1 - normalizedY, 0.6)); // Enhanced brightness curve
    
    // Convert HSV to RGB with enhanced precision
    const [r, g, b] = hsvToRgb(hue, saturation, value);
    
    // Convert RGB to HEX with validation
    const hexColor = rgbToHex(r, g, b);
    
    // Color properties are available via store methods
    
    // Update the selected color and position in store
    set({ 
      selectedColor: hexColor,
      pickerPosition: { x: position.x, y: position.y }
    });
    
    return hexColor;
  },
  
  getColorLuminance: (color: string) => {
    // Parse hex color to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return getRelativeLuminance(r, g, b);
  },
  
  isColorLight: (color: string) => {
    const luminance = get().getColorLuminance(color);
    return luminance > 0.5;
  },
}));
