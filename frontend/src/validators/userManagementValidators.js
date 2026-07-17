export const validateUserManagementField = (name, value, formData) => {
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
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = '"email" must be a valid email';
      }
      break;

    case "password":
      if (!value) {
        error = '"password" is required';
      } else if (value.length < 8) {
        error = '"password" length must be at least 8 characters long';
      }
      break;

    case "confirmPassword":
      if (!value) {
        error = '"confirmPassword" is required';
      } else if (value !== formData.password) {
        error = "Password and Confirm Password do not match";
      }
      break;

    case "role":
      if (!value) {
        error = '"role" is required';
      }
      break;

    case "phoneNumber":
      if (!value.trim()) {
        error = '"phoneNumber" is required';
      } else if (value.trim().length !== 10 || !/^\d+$/.test(value.trim())) {
        error = '"phoneNumber" must be exactly 10 digits';
      }
      break;

    case "teamName":
      if (!value.trim()) {
        error = '"teamName" is required';
      }
      break;

    case "department":
      if (!value) {
        error = '"department" is required';
      }
      break;

    case "designation":
      if (!value) {
        error = '"designation" is required';
      }
      break;

    default:
      break;
  }

  return error;
};

export const validateUserManagementForm = (formData) => {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach((key) => {
    const error = validateUserManagementField(key, formData[key], formData);
    if (error) {
      errors[key] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
