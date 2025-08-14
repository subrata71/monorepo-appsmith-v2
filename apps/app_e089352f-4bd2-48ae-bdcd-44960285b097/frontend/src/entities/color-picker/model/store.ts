import { create } from 'zustand';
import type { ColorPickerState } from './types';

interface ColorPickerStore extends ColorPickerState {
  setSelectedColor: (color: string) => void;
}

export const useColorPickerStore = create<ColorPickerStore>((set) => ({
  colorPickerId: 'color-picker-container',
  swatchId: 'color-swatch-display', 
  selectedColor: '#3b82f6',
  setSelectedColor: (color: string) => set({ selectedColor: color }),
}));