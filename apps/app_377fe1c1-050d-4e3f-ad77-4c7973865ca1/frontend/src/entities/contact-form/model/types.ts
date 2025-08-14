export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactFormTouched {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
}

export interface ContactFormState {
  values: ContactForm;
  errors: ContactFormErrors;
  touched: ContactFormTouched;
  isSubmitting: boolean;
  isSuccess: boolean;
}