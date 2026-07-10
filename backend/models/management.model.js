import mongoose from "mongoose";

const managementSchema = new mongoose.Schema({
    managementKey: {
        type: String,
        required: true,
        unique: true
    },
    managementPassword: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model.Management || mongoose.model("Management", managementSchema);