import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_TOKEN = process.env.JWT_TOKEN;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const NODE_ENV = process.env.NODE_ENV;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE;
