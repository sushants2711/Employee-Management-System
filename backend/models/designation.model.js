import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    designationName: {
      type: String,
      required: true,
      unique: true,
    },
    designationCode: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, minimize: true }
);

export default mongoose.model.Designation ||
  mongoose.model("Designation", designationSchema);
