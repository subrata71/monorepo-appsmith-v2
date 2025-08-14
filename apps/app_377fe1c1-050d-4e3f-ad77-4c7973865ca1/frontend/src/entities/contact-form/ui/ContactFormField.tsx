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
    <div className="space-y-2">
      <Label htmlFor={fieldId} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
        {label}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          {...commonProps}
          rows={4}
          className={cn(showError && "border-destructive focus-visible:border-destructive")}
        />
      ) : (
        <Input
          {...commonProps}
          type={type}
          className={cn(showError && "border-destructive focus-visible:border-destructive")}
        />
      )}
      
      {showError && (
        <p id={`${fieldId}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});