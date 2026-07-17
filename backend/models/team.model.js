import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      default: null,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamDescription: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
