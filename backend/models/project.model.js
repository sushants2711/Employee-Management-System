import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    teamName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    assignBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"],
      default: "PLANNED",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
