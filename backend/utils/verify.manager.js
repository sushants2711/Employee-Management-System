import {
  internalServerErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from "./response.handler.js";

export const verifyManager = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return unauthorizedResponse(res, "Unauthorized User");
    }

    if (user.role !== "Manager") {
      return forbiddenResponse(res, "Access denied");
    }

    next();
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
