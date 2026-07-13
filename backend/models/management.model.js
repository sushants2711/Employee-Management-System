import mongoose from "mongoose";

const managementSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    forgotOtp: {
      type: String,
      default: null,
    },
    forgotOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.model.Management ||
  mongoose.model("Management", managementSchema);
