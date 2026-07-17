// Validates a single field for Department Creation
export const validateDepartmentField = (name, value) => {
  let error = "";

  switch (name) {
    case "departmentName":
      if (!value.trim()) {
        error = '"departmentName" is required';
      } else if (value.trim().length < 2) {
        error = '"departmentName" length must be at least 2 characters long';
      } else if (value.trim().length > 50) {
        error =
          '"departmentName" length must be less than or equal to 50 characters long';
      }
      break;

    case "departmentCode":
      if (!value.trim()) {
        error = '"departmentCode" is required';
      } else if (value.trim().length !== 6) {
        error = '"departmentCode" length must be exactly 6 characters long';
      }
      break;

    case "description":
      if (value.trim().length > 0) {
        if (value.trim().length < 10) {
          error = '"description" length must be at least 10 characters long';
        } else if (value.trim().length > 1000) {
          error =
            '"description" length must be less than or equal to 1000 characters long';
        }
      }
      break;

    case "status":
      if (value && value !== "ACTIVE" && value !== "INACTIVE") {
        error = '"status" must be [ACTIVE, INACTIVE]';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Department form
export const validateDepartmentForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateDepartmentField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
