import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Employee", "Manager", "Team Leader", "Management"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    isAvailable: {
      type: String,
      enum: [
        "Available",
        "Busy",
        "Do not distrub",
        "Appear offline",
        "Break Taken",
        "Meeting",
      ],
      default: "Available",
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpireTime: {
      type: Date,
    },
    profilePic: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    teamName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    userType: {
      type: String,
      enum: ["SUPERUSER", "NORMALUSER"],
      default: "NORMALUSER",
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
