import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// create project middleware
export const createProjectMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      projectName: joi.string().required(),
      description: joi.string().required(),
      teamName: joi.string().hex().length(24).required(),
      startDate: joi.date().required(),
      endDate: joi.date().optional().allow(""),
      status: joi
        .string()
        .valid("PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD")
        .default("PLANNED"),
      isActive: joi.boolean().default(true),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Project Validation",
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

// update project middleware
export const updateProjectMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      projectName: joi.string().min(5).max(500).trim().optional().allow(""),
      description: joi.string().min(10).max(500).trim().optional().allow(""),
      teamName: joi.string().hex().length(24).optional().allow(""),
      startDate: joi.date().optional().allow(""),
      endDate: joi.date().optional().allow(""),
      status: joi
        .string()
        .valid("PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD")
        .optional()
        .allow(""),
      isActive: joi.boolean().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Project Validation",
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

// update the project completed and with date
export const updateCompletedProjectMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      status: joi.string().valid("COMPLETED").required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Project Validation",
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
