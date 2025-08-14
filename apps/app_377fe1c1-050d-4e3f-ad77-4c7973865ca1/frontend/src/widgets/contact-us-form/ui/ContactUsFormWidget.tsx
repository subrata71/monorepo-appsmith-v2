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
    <div className="max-w-3xl mx-auto">
      {isSuccess && (
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-sm opacity-30" />
          <Alert className="relative border-0 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-lg rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <AlertDescription className="text-lg font-medium">
                Thank you for your message! We'll get back to you soon.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      
      <div className="relative animate-fade-in-up">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 rounded-3xl" />
        
        <Card className="relative border-0 shadow-none bg-transparent">
          <CardHeader className="pb-8 pt-8">
            <div className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Send us a Message
              </CardTitle>
              <p className="mt-3 text-gray-600 text-lg">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <ContactFormField
                    label="Name"
                    name="name"
                    type="text"
                    value={formValues.name}
                    error={errors.name}
                    touched={touched.name}
                    required
                    placeholder="John Doe"
                    onChange={(value) => handleFieldChange('name', value)}
                    onBlur={() => handleFieldBlur('name')}
                  />
                </div>
                
                <div className="space-y-2">
                  <ContactFormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    error={errors.email}
                    touched={touched.email}
                    required
                    placeholder="john@example.com"
                    onChange={(value) => handleFieldChange('email', value)}
                    onBlur={() => handleFieldBlur('email')}
                  />
                </div>
              </div>
              
              <ContactFormField
                label="Subject"
                name="subject"
                type="text"
                value={formValues.subject}
                error={errors.subject}
                touched={touched.subject}
                placeholder="What's this about?"
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
                placeholder="Tell us more about your inquiry..."
                onChange={(value) => handleFieldChange('message', value)}
                onBlur={() => handleFieldBlur('message')}
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValidToSubmit || isSubmitting}
                  size="lg"
                  className="w-full md:w-auto md:px-12 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});