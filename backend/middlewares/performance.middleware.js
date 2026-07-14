import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler";

// create performance middleware
export const createPerformaceMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).required(),
      project: joi.string().hex().length(24).required(),
      team: joi.string().hex().length(24).required(),
      task: joi.string().hex().length(24).required(),
      status: joi
        .string()
        .valid("EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT", "POOR")
        .required(),
      remarks: joi.string().optional().allow(""),
      strengths: joi.string().optional().allow(""),
      reviewedBy: joi.string().hex().length(24).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Performance Validation",
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

// update performance middleware
export const updatePerformanceMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).optional().allow(""),
      project: joi.string().hex().length(24).optional().allow(""),
      team: joi.string().hex().length(24).optional().allow(""),
      task: joi.string().hex().length(24).optional().allow(""),
      status: joi
        .string()
        .valid("EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT", "POOR")
        .optional()
        .allow(""),
      remarks: joi.string().optional().allow(""),
      strengths: joi.string().optional().allow(""),
      reviewedBy: joi.string().hex().length(24).optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Performance Validation",
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
