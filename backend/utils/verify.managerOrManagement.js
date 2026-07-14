import {
  internalServerErrorResponse,
  forbiddenResponse,
  unauthorizedResponse,
} from "./response.handler.js";

export const isManagerOrManagement = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return unauthorizedResponse(res, "Unauthorized User");
    }

    if (user.role !== "Manager" && user.role !== "Management") {
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
