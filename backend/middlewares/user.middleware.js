import joi from "joi";
import {
  badRequestResponse,
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// user registration for manager
export const userRegistrationForManagerMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      name: joi.string().min(3).max(50).trim().required(),
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
      phoneNumber: joi.string().length(10).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at User Registration Validation",
        error?.details?.[0]?.message
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

// otp checker middleware
export const otpCheckerMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      otp: joi.string().length(4).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at OTP Checker Validation",
        error?.details?.[0]?.message
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

// login middleware via email
export const loginUserByEmailMiddleware = async (req, res, next) => {
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
        error?.details?.[0]?.message
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

// login middleware via emp id
export const loginUserByEmployeeIdMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employeeId: joi.string().length(6).trim().required(),
      password: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Login Validation",
        error?.details?.[0]?.message
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

// change the password
export const changePasswordMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      oldPassword: joi.string().min(8).max(100).required(),
      newPassword: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Change Password Validation",
        error?.details?.[0]?.message
      );
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return badRequestResponse(res, "Wrong Password Credentials");
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

// user forgot password middleware with email
export const userForgotPasswordEmailMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().min(10).max(50).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Forgot Password Validation",
        error?.details?.[0]?.message
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

// user forgot password with employee id
export const userForgotPasswordEmployeeIdMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const schema = joi.object({
      empId: joi.string().length(6).trim().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Forgot Password Validation",
        error?.details?.[0]?.message
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
      otp: joi.string().length(4).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Reset Password Validation",
        error?.details?.[0]?.message
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
        error?.details?.[0]?.message
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
        error?.details?.[0]?.message
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
        error?.details?.[0]?.message
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
        error?.details?.[0]?.message
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

// create the account
export const createAccountMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      name: joi.string().min(3).max(50).trim().required(),
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
      role: joi.string().valid("Employee", "Manager", "Team Leader").required(),
      phoneNumber: joi.string().length(10).trim().required(),
      teamName: joi.string().hex().length(24).optional().allow(""),
      designation: joi.string().hex().length(24).optional().allow(""),
      department: joi.string().hex().length(24).optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Create Account Validation",
        error?.details?.[0]?.message
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

// update the profile of manager
export const updateManagerProfileMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      password: joi.string().min(8).max(100).optional().allow(""),
      teamName: joi.string().hex().length(24).optional().allow(""),
      designation: joi.string().hex().length(24).optional().allow(""),
      department: joi.string().hex().length(24).optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Update Manager Profile Validation",
        error?.details?.[0]?.message
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

// update user middleware
