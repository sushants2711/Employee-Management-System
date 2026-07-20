// Validates a single field for Team Creation
export const validateTeamField = (name, value) => {
  let error = "";

  switch (name) {
    case "teamName":
      if (!value.trim()) {
        error = '"teamName" is required';
      } else if (value.trim().length < 5) {
        error = '"teamName" length must be at least 5 characters long';
      } else if (value.trim().length > 100) {
        error =
          '"teamName" length must be less than or equal to 100 characters long';
      }
      break;

    case "teamDescription":
      if (value.trim().length > 0) {
        if (value.trim().length < 10) {
          error =
            '"teamDescription" length must be at least 10 characters long';
        } else if (value.trim().length > 250) {
          error =
            '"teamDescription" length must be less than or equal to 250 characters long';
        }
      }
      break;

    case "department":
      if (!value) {
        error = '"department" is required';
      }
      break;

    case "manager":
      if (!value) {
        error = '"manager" is required';
      }
      break;

    case "teamLead":
      if (!value) {
        error = '"teamLead" is required';
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

// Validates the entire Team form
export const validateTeamForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateTeamField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
