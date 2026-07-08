import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_TOKEN = process.env.JWT_TOKEN;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const NODE_ENV = process.env.NODE_ENV;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const SUPERUSER_COOKIE_NAME = process.env.SUPERUSER_COOKIE_NAME;
export const SUPERUSER_COOKIE_DATA = process.env.SUPERUSER_COOKIE_DATA;
export const SUPERUSER_ENCRYPTION_KEY = process.env.SUPERUSER_ENCRYPTION_KEY;
export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE;
