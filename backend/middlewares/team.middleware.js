import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// create team middleware
export const createTeamMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      teamName: joi.string().min(5).max(100).trim().required(),
      teamDescription: joi
        .string()
        .min(10)
        .max(250)
        .trim()
        .optional("")
        .allow(""),
      teamLead: joi.string().hex().length(24).optional().allow(""),
      manager: joi.string().hex().length(24).required(),
      department: joi.string().hex().length(24).required(),
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

// update team middleware
export const updateTeamMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      teamName: joi.string().min(5).max(100).trim().optional().allow(""),
      teamDescription: joi
        .string()
        .min(10)
        .max(250)
        .trim()
        .optional("")
        .allow(""),
      teamLead: joi.string().hex().length(24).optional().allow(""),
      manager: joi.string().hex().length(24).optional().allow(""),
      status: joi.string().valid("ACTIVE", "INACTIVE").optional().allow(""),
      department: joi.string().hex().length(24).optional().allow(""),
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
