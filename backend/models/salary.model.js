import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    hra: {
      type: Number,
      default: 0,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    bonus: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    grossSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["BANK_TRANSFER", "CASH", "CHEQUE", "UPI"],
      default: "BANK_TRANSFER",
    },
    transactionReference: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      default: "Completed",
    },
    paidLeaveUsed: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    unpaidLeaveDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLeaveTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Salary || mongoose.model("Salary", salarySchema);
