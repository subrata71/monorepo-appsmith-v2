import { useState } from 'react';
import { Button, Input } from '@/shared/ui';

interface OperationControlProps {
  label: string;
  placeholder: string;
  buttonText: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const OperationControl = ({ 
  label, 
  placeholder, 
  buttonText, 
  onSubmit, 
  disabled = false,
  variant = 'default'
}: OperationControlProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue(''); // Clear input after submission
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={disabled || !value.trim()}
          variant={variant}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  );
};