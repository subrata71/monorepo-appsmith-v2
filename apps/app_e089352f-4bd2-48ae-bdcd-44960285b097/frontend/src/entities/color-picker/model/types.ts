export interface ColorPickerContainer {
  id: string;
  role: string;
  ariaLabel: string;
  type: string;
}

export interface ColorSwatch {
  id: string;
  role: string;
  ariaLabel: string;
  type: string;
  color: string;
}

export interface PickerPosition {
  x: number;
  y: number;
}

export interface ColorPickerState {
  colorPickerId: string;
  swatchId: string;
  selectedColor: string;
  isTrackingPointer: boolean;
  pickerPosition: PickerPosition;
}
