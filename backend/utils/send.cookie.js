import jwt from "jsonwebtoken";
import { JWT_TOKEN, COOKIE_NAME } from "../config/constant.js";
import { JWT_EXPIRES_IN } from "../config/constant.js";
import { internalServerErrorResponse } from "./response.handler.js";
import { cookieOptionsSetting } from "./cookieOptions.js";

export const sendCookieToUser = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, JWT_TOKEN, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(COOKIE_NAME, token, cookieOptionsSetting);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
