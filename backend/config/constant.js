import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_TOKEN = process.env.JWT_TOKEN;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const NODE_ENV = process.env.NODE_ENV;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
