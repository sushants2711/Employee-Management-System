// Validates a single field for Signup
export const validateSignupField = (name, value, formData) => {
  let error = "";

  switch (name) {
    case "name":
      if (!value.trim()) {
        error = '"name" is required';
      } else if (value.trim().length < 3) {
        error = '"name" length must be at least 3 characters long';
      } else if (value.trim().length > 50) {
        error =
          '"name" length must be less than or equal to 50 characters long';
      }
      break;

    case "email":
      if (!value.trim()) {
        error = '"email" is required';
      } else if (value.trim().length < 10) {
        error = '"email" length must be at least 10 characters long';
      } else if (value.trim().length > 50) {
        error =
          '"email" length must be less than or equal to 50 characters long';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = '"email" must be a valid email';
      }
      break;

    case "phoneNumber":
      if (!value.trim()) {
        error = '"phoneNumber" is required';
      } else if (!/^\d{10}$/.test(value.trim())) {
        error = '"phoneNumber" length must be 10 characters long';
      }
      break;

    case "password":
      if (!value) {
        error = '"password" is required';
      } else if (value.length < 8) {
        error = '"password" length must be at least 8 characters long';
      } else if (value.length > 100) {
        error =
          '"password" length must be less than or equal to 100 characters long';
      }
      break;

    case "confirmPassword":
      if (!value) {
        error = '"confirmPassword" is required';
      } else if (value !== formData.password) {
        error = '"confirmPassword" must match "password"';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Signup form
export const validateSignupForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateSignupField(key, formData[key], formData);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validates a single field for Login
export const validateLoginField = (name, value, loginMethod) => {
  let error = "";

  switch (name) {
    case "identifier":
      if (!value.trim()) {
        error =
          loginMethod === "email"
            ? '"email" is required'
            : '"employeeId" is required';
      } else if (loginMethod === "email") {
        if (value.trim().length < 10) {
          error = '"email" length must be at least 10 characters long';
        } else if (value.trim().length > 50) {
          error =
            '"email" length must be less than or equal to 50 characters long';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = '"email" must be a valid email';
        }
      } else if (loginMethod === "empid") {
        if (value.trim().length !== 6) {
          error = '"employeeId" length must be 6 characters long';
        }
      }
      break;

    case "password":
      if (!value) {
        error = '"password" is required';
      } else if (value.length < 8) {
        error = '"password" length must be at least 8 characters long';
      } else if (value.length > 100) {
        error =
          '"password" length must be less than or equal to 100 characters long';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Login form
export const validateLoginForm = (formData, loginMethod) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateLoginField(key, formData[key], loginMethod);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validates a single field for Change Password
export const validateChangePasswordField = (name, value, formData) => {
  let error = "";

  switch (name) {
    case "oldPassword":
      if (!value) {
        error = '"oldPassword" is required';
      } else if (value.length < 8) {
        error = '"oldPassword" length must be at least 8 characters long';
      }
      break;

    case "newPassword":
      if (!value) {
        error = '"newPassword" is required';
      } else if (value.length < 8) {
        error = '"newPassword" length must be at least 8 characters long';
      }
      break;

    case "confirmPassword":
      if (!value) {
        error = '"confirmPassword" is required';
      } else if (formData && value !== formData.newPassword) {
        error = '"confirmPassword" must match "newPassword"';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Change Password form
export const validateChangePasswordForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateChangePasswordField(key, formData[key], formData);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
