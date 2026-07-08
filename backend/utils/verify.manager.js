import { internalServerErrorResponse, unauthorizedResponse, forbiddenResponse } from "./response.handler.js";

export const isManager = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return unauthorizedResponse(res, "Unauthorized User");
        };

        // Check both userType and role
        if (user.userType !== "NORMALUSER" || user.role !== "Manager") {
            return forbiddenResponse(res, "Access denied");
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    }
};
