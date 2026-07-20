import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler";

// cretae task middleware
export const createTaskMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      taskName: joi.string().min(5).max(500).trim().required(),
      description: joi.string().min(10).max(500).trim().optional().allow(""),
      project: joi.string().hex().length(24).required(),
      team: joi.string().hex().length(24).required(),
      assignedTo: joi.string().hex().length(24).required(),
      priority: joi
        .string()
        .valid("LOW", "MEDIUM", "HIGH", "URGENT")
        .optional()
        .allow(""),
      startDate: joi.date().required(),
      dueDate: joi.date().required(),
      remarks: joi.string().min(5).max(500).trim().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Task Validation",
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

// update the task middleware
export const updateTaskMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      taskName: joi.string().min(5).max(500).trim().optional().allow(""),
      description: joi.string().min(10).max(500).trim().optional().allow(""),
      project: joi.string().hex().length(24).optional().allow(""),
      team: joi.string().hex().length(24).optional().allow(""),
      assignedTo: joi.string().hex().length(24).optional().allow(""),
      status: joi
        .string()
        .valid(
          "TODO",
          "IN_PROGRESS",
          "IN_REVIEW",
          "TESTING",
          "COMPLETED",
          "BLOCKED"
        )
        .optional()
        .allow(""),
      priority: joi
        .string()
        .valid("LOW", "MEDIUM", "HIGH", "URGENT")
        .optional()
        .allow(""),
      startDate: joi.date().optional().allow(""),
      dueDate: joi.date().optional().allow(""),
      remarks: joi.string().min(5).max(500).trim().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Task Validation",
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

// update the task completed at middleware
export const updateTaskCompletedAtMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      completedAt: joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Task Validation",
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
