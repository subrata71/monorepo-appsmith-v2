import { Input, Label } from '@/shared/ui';
import { useTreeVisualizerStore } from '@/shared/model/tree-visualizer-store';

interface NodeInputProps {
  onValueChange: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export const NodeInput = ({ 
  onValueChange, 
  isDisabled = false,
  placeholder = "Enter integer value"
}: NodeInputProps) => {
  const inputValue = useTreeVisualizerStore(state => state.inputValue);
  const isInputValid = useTreeVisualizerStore(state => state.isInputValid);
  const inputError = useTreeVisualizerStore(state => state.inputError);
  const setInputValue = useTreeVisualizerStore(state => state.setInputValue);
  const setInputValid = useTreeVisualizerStore(state => state.setInputValid);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onValueChange(value);
    
    // Basic validation
    if (value === '') {
      setInputValid(true);
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setInputValid(false, 'Please enter a valid number');
      return;
    }
    
    if (!Number.isInteger(numValue)) {
      setInputValid(false, 'Please enter an integer');
      return;
    }
    
    if (numValue < -1000000 || numValue > 1000000) {
      setInputValid(false, 'Value must be between -1,000,000 and 1,000,000');
      return;
    }
    
    setInputValid(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isInputValid && inputValue.trim() !== '') {
      // Trigger add node via parent component
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="node-input">Node Value</Label>
      <Input
        id="node-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isDisabled}
        className={!isInputValid ? 'border-red-500 focus-visible:ring-red-500' : ''}
      />
      {!isInputValid && inputError && (
        <p className="text-sm text-red-600">{inputError}</p>
      )}
    </div>
  );
};