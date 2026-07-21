export const validateTaskField = (name, value) => {
  let error = "";

  switch (name) {
    case "taskName":
      if (!value || !value.trim()) {
        error = '"taskName" is required';
      } else if (value.trim().length < 3) {
        error = '"taskName" length must be at least 3 characters long';
      } else if (value.trim().length > 500) {
        error =
          '"taskName" length must be less than or equal to 500 characters long';
      }
      break;

    case "description":
      if (value && value.trim().length < 10) {
        error = '"description" length must be at least 10 characters long';
      } else if (value && value.trim().length > 500) {
        error =
          '"description" length must be less than or equal to 500 characters long';
      }
      break;

    case "priority":
      if (value && !["LOW", "MEDIUM", "HIGH", "URGENT"].includes(value)) {
        error = '"priority" must be [LOW, MEDIUM, HIGH, URGENT]';
      }
      break;

    case "status":
      if (
        value &&
        ![
          "TODO",
          "IN_PROGRESS",
          "IN_REVIEW",
          "TESTING",
          "COMPLETED",
          "BLOCKED",
        ].includes(value)
      ) {
        error =
          '"status" must be [TODO, IN_PROGRESS, IN_REVIEW, TESTING, COMPLETED, BLOCKED]';
      }
      break;

    default:
      break;
  }

  return error;
};

// Validates the entire Task form
export const validateTaskForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    if (key === "mode") return;
    const error = validateTaskField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
