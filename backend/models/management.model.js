import mongoose from "mongoose";

const managementSchema = new mongoose.Schema(
  {
    managementKey: {
      type: String,
      required: true,
      unique: true,
    },
    managementPassword: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    managementOtp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    managementForgotOtp: {
      type: String,
      default: null,
    },
    managementForgotOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.model.Management ||
  mongoose.model("Management", managementSchema);
