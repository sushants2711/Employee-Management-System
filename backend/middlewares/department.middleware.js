import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// create department middleware
export const createDepartmentMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      departmentName: joi.string().min(2).max(50).trim().required(),
      departmentCode: joi.string().min(5).max(50).trim().required(),
      description: joi.string().optional().allow(""),
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

// update department middleware
export const updateDepartmentMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      departmentName: joi.string().min(2).max(50).trim().optional().allow(""),
      departmentCode: joi.string().min(5).max(50).trim().optional().allow(""),
      description: joi.string().optional().allow(""),
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
