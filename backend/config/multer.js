import multer from "multer";
import { storage } from "./cloudinary.config.js";

export const uploadEmployeeImage = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    }
});