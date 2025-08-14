import React from 'react';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';

interface ContactFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export const ContactFormField = React.memo<ContactFormFieldProps>(({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required = false,
  placeholder,
  onChange,
  onBlur,
}) => {
  const showError = touched && error;
  const fieldId = `contact-form-${name}`;

  const handleInputChange = React.useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(event.target.value);
  }, [onChange]);

  const commonProps = {
    id: fieldId,
    name,
    value,
    placeholder,
    onChange: handleInputChange,
    onBlur,
    'aria-invalid': showError ? 'true' : 'false',
    'aria-describedby': showError ? `${fieldId}-error` : undefined,
  };

  return (
    <div className="space-y-3">
      <Label 
        htmlFor={fieldId} 
        className={cn(
          "text-sm font-semibold text-gray-700 flex items-center gap-1",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        {type === 'textarea' ? (
          <Textarea
            {...commonProps}
            rows={5}
            className={cn(
              "bg-white/80 border-2 border-gray-200 rounded-xl px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none hover:border-gray-300 focus:bg-white shadow-sm hover:shadow-md",
              showError && "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/50 hover:border-red-300",
              !showError && value && "border-green-300 bg-green-50/30 hover:border-green-400"
            )}
          />
        ) : (
          <Input
            {...commonProps}
            type={type}
            className={cn(
              "bg-white/80 border-2 border-gray-200 rounded-xl px-4 py-3 h-12 text-base transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 focus:bg-white shadow-sm hover:shadow-md",
              showError && "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/50 hover:border-red-300",
              !showError && value && "border-green-300 bg-green-50/30 hover:border-green-400"
            )}
          />
        )}
        
        {/* Success indicator */}
        {!showError && value && (
          <div className="absolute right-3 top-3 text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Error indicator */}
        {showError && (
          <div className="absolute right-3 top-3 text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {showError && (
        <div className="flex items-center gap-2 text-red-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p id={`${fieldId}-error`} className="text-sm font-medium" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
});