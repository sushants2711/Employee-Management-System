import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    totalTimeInOffice: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "WEEK_OFF", "HOLIDAY"],
      required: true,
    },
    leave: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);
