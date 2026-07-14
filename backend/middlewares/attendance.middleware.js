import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.handler";

export const createAttendanceMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).required(),
      date: joi.date().required(),
      checkInTime: joi.date().optional().allow(""),
      checkOutTime: joi.date().optional().allow(""),
      status: joi
        .string()
        .valid("PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "WEEK_OFF", "HOLIDAY")
        .required(),
      leave: joi.string().hex().length(24).optional().allow(null),
      remarks: joi.string().optional().allow(""),
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

// update the attendance middleware
export const updateAttendanceMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).optional().allow(""),
      date: joi.date().optional().allow(""),
      status: joi
        .string()
        .valid("PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "WEEK_OFF", "HOLIDAY")
        .optional(),
      leave: joi.string().hex().length(24).optional().allow(null),
      remarks: joi.string().optional().allow(""),
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
