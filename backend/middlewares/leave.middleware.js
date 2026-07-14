import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler.js";

// create a leave middleware
export const createLeaveMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).required(),
      leaveType: joi
        .string()
        .valid("CASUAL", "SICK", "PAID", "UNPAID")
        .required(),
      fromDate: joi.date().required(),
      toDate: joi.date().required(),
      totalDays: joi.number().min(1).required(),
      reason: joi.string().min(10).max(500).trim().required(),
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

// update the leave middleware status only
export const updateLeaveMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      status: joi
        .string()
        .valid("APPROVED", "REJECTED", "CANCELLED")
        .required(),
      remarks: joi.string().min(10).max(500).trim().optional().allow(""),
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
