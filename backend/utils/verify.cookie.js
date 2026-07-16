import jwt from "jsonwebtoken";
import { JWT_TOKEN, COOKIE_NAME } from "../config/constant.js";
import {
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "./response.handler.js";
import userModel from "../models/user.model.js";

export const verifyCookie = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return unauthorizedResponse(res, "Unauthorized User");
    }

    const decodedToken = jwt.verify(token, JWT_TOKEN);

    if (!decodedToken || !decodedToken?.userId) {
      return unauthorizedResponse(res, "Invalid Token");
    }

    const user = await userModel
      .findById(decodedToken?.userId)
      .select("-password");

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
