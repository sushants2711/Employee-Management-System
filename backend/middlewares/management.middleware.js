import joi from "joi";
import {
  badRequestResponse,
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// signup management middleware
export const signupManagementMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
      confirmPassword: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Management Signup Validation",
        error?.details?.[0]?.message
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return badRequestResponse(res, "Invalid Credentials");
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

// login management middleware
export const loginManagementMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().min(10).max(50).trim().required(),
      password: joi.string().min(8).max(100).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Management Login Validation",
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

// otp verify middleware
export const otpManagementMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      otp: joi
        .string()
        .length(4)
        .pattern(/^[0-9]{4}$/)
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at OTP Validation",
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

// forgot password middleware
export const forgotManagementPasswordMiddleware = async (req, res, next) => {
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

// reset password middleware
export const resetManagementPasswordMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      otp: joi
        .string()
        .length(4)
        .pattern(/^[0-9]{4}$/)
        .required(),
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
      return badRequestResponse(res, "Invalid Credentials");
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
