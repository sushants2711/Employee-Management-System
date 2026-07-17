import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// create designation middleware
export const createDesignationMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      designationName: joi.string().min(2).max(50).trim().required(),
      designationCode: joi.string().length(6).trim().required(),
      description: joi.string().min(10).max(1000).trim().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Invalid Format",
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

// update designation middleware
export const updateDesignationMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      designationName: joi.string().min(2).max(50).trim().optional().allow(""),
      designationCode: joi.string().length(6).trim().optional().allow(""),
      description: joi.string().min(10).max(1000).trim().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Invalid Format",
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
