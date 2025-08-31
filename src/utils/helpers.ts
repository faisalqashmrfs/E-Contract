import { checkIfEmailValid } from "./form";

/**
 * Interface for form data
 */
export interface FormData {
  full_name: string;
  id_number: string;
  phone: string;
  email: string;
  approval: boolean;
  image?: File | null;
}

/**
 * Interface for form errors
 */
export interface FormErrors {
  full_name: string;
  id_number: string;
  phone: string;
  email: string;
  approval: string;
  image: string;
  general: string;
}

/**
 * Create API request configuration with appropriate headers
 * @param contentType - The content type for the request
 * @returns - Configuration object with headers
 */
export const createApiConfig = (contentType = 'multipart/form-data') => {
  return {
    headers: {
      'Content-Type': contentType,
      'Accept-Language': 'ar',
      'X-Language': 'ar',
      'lang': 'ar'
    }
  };
};

/**
 * Validate a specific form field
 * 
 * @param field - The field name to validate
 * @param value - The value to validate
 * @returns - Error message or empty string if valid
 */
export const validateField = (field: string, value: any): string => {
  let fieldError = '';
  
  switch (field) {
    case 'id_number':
      if (!/^\d+$/.test(value)) {
        fieldError = 'الرقم الوطني يجب أن يكون رقماً صحيحاً';
      } else if (value.length < 6) {
        fieldError = 'الرقم الوطني يجب أن يكون 6 أرقام على الأقل';
      }
      break;
    case 'phone':
      if (!/^\d+$/.test(value)) {
        fieldError = 'رقم الهاتف يجب أن يكون رقماً صحيحاً';
      } else if (value.length > 16) {
        fieldError = 'رقم الهاتف يجب ألا يتجاوز 16 رقماً';
      }
      break;
    case 'email':
      if (value && !checkIfEmailValid(value)) {
        fieldError = 'البريد الإلكتروني غير صالح';
      }
      break;
    default:
      break;
  }
  
  return fieldError;
};

/**
 * Validate all form fields
 * 
 * @param formData - The form data to validate
 * @param errors - The current error state
 * @returns - Object with hasErrors flag and updated errors object
 */
export const validateAllFields = (formData: FormData, errors: FormErrors): { formHasErrors: boolean; newErrors: FormErrors } => {
  let formHasErrors = false;
  let newErrors = {...errors};
  
  // Check all fields
  Object.keys(formData).forEach(key => {
    const field = key as keyof FormData;
    const value = formData[field];
    
    // Skip validation for optional fields
    if (field === 'image') {
      return;
    }
    
  });
  
  if (formHasErrors) {
    newErrors.general = 'الرجاء ملء جميع الحقول والموافقة على الشروط';
  }
  
  return { formHasErrors, newErrors };
};

/**
 * Safely converts a string to an integer
 * 
 * @param value - The string value to convert
 * @returns - The integer value or the original string if conversion fails
 */
export const safeParseInt = (value: string): number | string => {
  // Remove any non-digit characters
  const cleanValue = value.replace(/\D/g, '');
  
  // If we have digits, convert to integer
  if (cleanValue.length > 0) {
    return parseInt(cleanValue, 10);
  }
  
  // Return the original value if we couldn't parse it
  return value;
};

/**
 * Prepare form data for submission
 * 
 * @param formData - The form data to prepare
 * @returns - The prepared data ready for API submission
 */
export const prepareSubmitData = (formData: FormData) => {
  return {
    full_name: formData.full_name,
    id_number: safeParseInt(formData.id_number),
    phone: safeParseInt(formData.phone),
    email: formData.email,
    approval: formData.approval ? 1 : 0,
    // Don't include image in the prepared data as it will be handled separately
    // when creating FormData for the API request
  };
};