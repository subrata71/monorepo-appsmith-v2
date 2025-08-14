export type { 
  ContactForm, 
  ContactFormErrors, 
  ContactFormTouched, 
  ContactFormState 
} from './model/types';

export { 
  validateField, 
  validateForm, 
  isFormValid 
} from './model/validation';

export { ContactFormField } from './ui/ContactFormField';