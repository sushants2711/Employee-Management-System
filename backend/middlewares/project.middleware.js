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
      manager: joi.string().hex().length(24).required(),
      teamLeader: joi.string().hex().length(24).required(),
      startDate: joi.date().required(),
      endDate: joi.date().optional().allow(""),
      assignBy: joi.string().hex().length(24).required(),
      members: joi.array().items(joi.string().hex().length(24)).required(),
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
