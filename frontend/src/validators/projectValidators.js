export const validateProjectField = (name, value) => {
  let error = "";

  switch (name) {
    case "projectName":
      if (!value || !value.trim()) {
        error = '"projectName" is required';
      } else if (value.trim().length < 5) {
        error = '"projectName" length must be at least 5 characters long';
      } else if (value.trim().length > 500) {
        error =
          '"projectName" length must be less than or equal to 500 characters long';
      }
      break;

    case "description":
      if (!value || !value.trim()) {
        error = '"description" is required';
      } else if (value.trim().length < 10) {
        error = '"description" length must be at least 10 characters long';
      } else if (value.trim().length > 500) {
        error =
          '"description" length must be less than or equal to 500 characters long';
      }
      break;

    case "teamName":
      if (!value) {
        error = '"teamName" is required';
      }
      break;

    case "startDate":
      if (!value) {
        error = '"startDate" is required';
      }
      break;

    case "endDate":
      // Optional, but if provided should be valid. We don't enforce strict date logic here, just pass.
      break;

    case "status":
      if (
        value &&
        !["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].includes(value)
      ) {
        error = '"status" must be [PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD]';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Project form
export const validateProjectForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    // Only validate teamName if it exists in the payload (during CREATE)
    if (key === "teamName" && formData.mode === "UPDATE") {
      return;
    }
    const error = validateProjectField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
