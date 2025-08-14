import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { 
  ContactFormField,
  type ContactForm,
  type ContactFormErrors,
  type ContactFormTouched,
  validateField,
  validateForm,
  isFormValid
} from '@/entities/contact-form';

const initialFormValues: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const initialTouched: ContactFormTouched = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

export const ContactUsFormWidget = React.memo(() => {
  const [formValues, setFormValues] = useState<ContactForm>(initialFormValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<ContactFormTouched>(initialTouched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle field value change
  const handleFieldChange = useCallback((fieldName: keyof ContactForm, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  }, [errors]);

  // Handle field blur (validation)
  const handleFieldBlur = useCallback((fieldName: keyof ContactForm) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));

    const fieldError = validateField(fieldName, formValues[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError || undefined,
    }));
  }, [formValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm(formValues);
    setErrors(formErrors);
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    // If form has errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success
      setFormValues(initialFormValues);
      setErrors({});
      setTouched(initialTouched);
      setIsSuccess(true);
    } catch (error) {
      // In a real app, handle submission errors here
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues]);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const isFormValidToSubmit = isFormValid(formValues);

  return (
    <div className="max-w-2xl mx-auto">
      {isSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
          <AlertDescription>
            Thank you for your message! We'll get back to you soon.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactFormField
                label="Name"
                name="name"
                type="text"
                value={formValues.name}
                error={errors.name}
                touched={touched.name}
                required
                placeholder="Enter your full name"
                onChange={(value) => handleFieldChange('name', value)}
                onBlur={() => handleFieldBlur('name')}
              />
              
              <ContactFormField
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                error={errors.email}
                touched={touched.email}
                required
                placeholder="Enter your email address"
                onChange={(value) => handleFieldChange('email', value)}
                onBlur={() => handleFieldBlur('email')}
              />
            </div>
            
            <ContactFormField
              label="Subject"
              name="subject"
              type="text"
              value={formValues.subject}
              error={errors.subject}
              touched={touched.subject}
              placeholder="Enter the subject of your message"
              onChange={(value) => handleFieldChange('subject', value)}
              onBlur={() => handleFieldBlur('subject')}
            />
            
            <ContactFormField
              label="Message"
              name="message"
              type="textarea"
              value={formValues.message}
              error={errors.message}
              touched={touched.message}
              required
              placeholder="Enter your message here..."
              onChange={(value) => handleFieldChange('message', value)}
              onBlur={() => handleFieldBlur('message')}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isFormValidToSubmit || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});