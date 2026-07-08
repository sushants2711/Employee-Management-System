import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true
    },
    departmentCode: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: null
    },


}, { timestamps: true, minimize: true });

export default mongoose.model.Department || mongoose.model("Department", departmentSchema);