import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["CASUAL", "SICK", "PAID", "UNPAID"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedAt: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      default: null,
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
    totalLeaveLeft: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Leave || mongoose.model("Leave", leaveSchema);
