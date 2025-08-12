export interface NumberInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
