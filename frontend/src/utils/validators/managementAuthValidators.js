// Validates a single field (for onChange events)
export const validateManagementSignupField = (name, value, formData) => {
  let error = "";

  switch (name) {
    case "name":
      if (!value.trim()) {
        error = "Name is required";
      } else if (value.trim().length < 3) {
        error = "Name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        error = "Name cannot exceed 50 characters";
      }
      break;

    case "email":
      if (!value.trim()) {
        error = "Email is required";
      } else if (value.trim().length < 10) {
        error = "Email must be at least 10 characters";
      } else if (value.trim().length > 50) {
        error = "Email cannot exceed 50 characters";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
      break;

    case "phoneNumber":
      if (!value.trim()) {
        error = "Phone number is required";
      } else if (!/^\d{10}$/.test(value.trim())) {
        error = "Phone number must be exactly 10 digits";
      }
      break;

    case "password":
      if (!value) {
        error = "Password is required";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters";
      } else if (value.length > 100) {
        error = "Password cannot exceed 100 characters";
      }
      // Re-validate confirmPassword if password changes
      break;

    case "confirmPassword":
      if (!value) {
        error = "Please confirm your password";
      } else if (value !== formData.password) {
        error = "Passwords do not match";
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire form before submission
export const validateManagementSignupForm = (formData) => {
  const errors = {};

  // Run the field validation for every key in formData
  Object.keys(formData).forEach((key) => {
    const error = validateManagementSignupField(key, formData[key], formData);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
