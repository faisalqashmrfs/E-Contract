/**
 * Handle form changes and update the current state.
 *
 * @param {string} key - The key of the form field.
 * @param {string | number | any} value - The new value of the form field.
 * @param {Function} setFunction - The function to update the form state.
 */
export const handleChange = (
  key: string,
  value: string | number | any,
  setFunction: Function,
) => {
  setFunction((prev: any) => {
    return {
      ...prev,
      [key]: value,
    };
  });
};

/**
 * Check if the form is valid.
 *
 * @param {object} form - The form object.
 * @param {string[]} mandatoryFields - The array of mandatory field keys.
 * @returns {boolean} - Returns true if the form is valid, false otherwise.
 */
export const checkIfFormValid = (
  form: any,
  mandatoryFields: string[],
): boolean => {
  let _formComplete = true;
  for (let index = 0; index < mandatoryFields.length; index++) {
    const field = mandatoryFields[index];
    if (!form[field] || form[field].length <= 0) {
      _formComplete = false;
      break;
    }
  }
  return _formComplete;
};

/**
 * Check if an email is valid.
 *
 * @param {string} email - The email to check.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
export const checkIfEmailValid = (email: string): boolean => {
  const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return regex.test(email);
};

/**
 * Check if a password is valid.
 *
 * @param {string} password - The password to check.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
export const checkIfPasswordValid = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/;
  return regex.test(password);
};
