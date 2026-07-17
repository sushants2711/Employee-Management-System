export const validateDesignationField = (name, value) => {
  let error = "";

  switch (name) {
    case "designationName":
      if (!value.trim()) {
        error = '"designationName" is required';
      } else if (value.trim().length < 2) {
        error = '"designationName" length must be at least 2 characters long';
      } else if (value.trim().length > 50) {
        error =
          '"designationName" length must be less than or equal to 50 characters long';
      }
      break;

    case "designationCode":
      if (!value.trim()) {
        error = '"designationCode" is required';
      } else if (value.trim().length !== 6) {
        error = '"designationCode" length must be exactly 6 characters long';
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

    case "department":
      if (!value) {
        error = '"department" is required';
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

export const validateDesignationForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateDesignationField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
