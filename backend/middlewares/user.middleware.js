import joi from "joi";
import {
  badRequestResponse,
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler";

// user registration middleware
export const userRegistrationMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employeeId: joi.string().min(6).max(6).trim().required(),
      name: joi.string().min(3).max(50).trim().required(),
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
      role: joi
        .string()
        .valid("Employee", "Manager", "Team Leader", "Management")
        .required(),
      phoneNumber: joi.string().min(13).max(13).trim().required(),
      designation: joi.string().trim().required(),
      department: joi.string().trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at User Registration Validation",
        error.message
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return badRequestResponse(
        res,
        "Password and Confirm Password do not match"
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// user login middleware
export const loginUserMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Login Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// user forgot password middleware
export const userForgotPasswordMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().min(10).max(50).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Forgot Password Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// user reset password middleware
export const resetPasswordMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      otp: joi.string().min(6).max(6).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Reset Password Validation",
        error.message
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return badRequestResponse(
        res,
        "Password and Confirm Password do not match"
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// user update password middleware
export const updatePasswordMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      oldPassword: joi.string().min(8).max(100).required(),
      newPassword: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update Password Validation",
        error.message
      );
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return badRequestResponse(
        res,
        "New Password and Confirm Password do not match"
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the role
export const updateUserRoleMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      role: joi
        .string()
        .valid("Employee", "Manager", "Team Leader", "Management")
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User Role Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the status
export const updateUserStatusMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      status: joi.string().valid("ACTIVE", "INACTIVE", "SUSPENDED").required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User Status Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the isAvailable
export const updateUserIsAvailableMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      isAvailable: joi
        .string()
        .valid(
          "Available",
          "Busy",
          "Do not distrub",
          "Appear offline",
          "Break Taken",
          "Meeting"
        )
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User IsAvailable Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the designation
export const updateUserDesignationMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      designation: joi.string().trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User Designation Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the department
export const updateUserDepartmentMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      department: joi.string().trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User Department Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the teamName
export const updateUserTeamNameMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      teamName: joi.string().trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User TeamName Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the phoneNumber
export const updateUserPhoneNumberMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      phoneNumber: joi.string().min(13).max(13).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User PhoneNumber Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the userType
export const updateUserTypeMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      userType: joi.string().valid("SUPERUSER", "NORMALUSER").required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update User Type Validation",
        error.message
      );
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
