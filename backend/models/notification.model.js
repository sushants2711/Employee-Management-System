import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "TASK",
        "LEAVE",
        "ATTENDANCE",
        "SALARY",
        "PERFORMANCE",
        "WEEKENDS",
        "ATTENDANCE_REMINDER",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    redirectUrl: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
