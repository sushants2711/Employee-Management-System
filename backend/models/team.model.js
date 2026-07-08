import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
