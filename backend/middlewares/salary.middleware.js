import joi from "joi";
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from "../utils/response.util.js";

// create salary middleware
export const createSalaryMiddleware = async (req, res, next) => {
  try {
    const schema = joi.object({
      employee: joi.string().hex().length(24).required(),
      month: joi.number().min(1).max(12).required(),
      year: joi.number().required(),
      basicSalary: joi.number().required(),
      hra: joi.number().optional().allow(""),
      allowances: joi.number().optional().allow(""),
      bonus: joi.number().optional().allow(""),
      deductions: joi.number().optional().allow(""),
      grossSalary: joi.number().required(),
      netSalary: joi.number().required(),
      paymentStatus: joi.string().valid("PENDING", "PAID", "FAILED").required(),
      paymentDate: joi.date().required(),
      paymentMode: joi
        .string()
        .valid("BANK_TRANSFER", "CASH", "CHEQUE", "UPI")
        .required(),
      transactionReference: joi.string().optional().allow(""),
      remarks: joi.string().optional().allow(""),
      paidLeaveUsed: joi.number().optional().allow(""),
      unpaidLeaveDays: joi.number().optional().allow(""),
      totalLeaveTaken: joi.number().optional().allow(""),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return validationErrorResponse(
        res,
        "Error Occured at Salary Validation",
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
