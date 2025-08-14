import type { ContactForm, ContactFormErrors } from './types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (fieldName: keyof ContactForm, value: string): string | null => {
  switch (fieldName) {
    case 'name':
      if (!value.trim()) {
        return 'Name is required';
      }
      if (value.trim().length < 2) {
        return 'Name must be at least 2 characters';
      }
      return null;

    case 'email':
      if (!value.trim()) {
        return 'Email is required';
      }
      if (!EMAIL_REGEX.test(value.trim())) {
        return 'Please enter a valid email address';
      }
      return null;

    case 'subject':
      // Subject is optional, no validation needed
      return null;

    case 'message':
      if (!value.trim()) {
        return 'Message is required';
      }
      if (value.trim().length < 10) {
        return 'Message must be at least 10 characters';
      }
      return null;

    default:
      return null;
  }
};

export const validateForm = (form: ContactForm): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  const nameError = validateField('name', form.name);
  if (nameError) errors.name = nameError;

  const emailError = validateField('email', form.email);
  if (emailError) errors.email = emailError;

  const subjectError = validateField('subject', form.subject);
  if (subjectError) errors.subject = subjectError;

  const messageError = validateField('message', form.message);
  if (messageError) errors.message = messageError;

  return errors;
};

export const isFormValid = (form: ContactForm): boolean => {
  const errors = validateForm(form);
  return Object.keys(errors).length === 0;
};