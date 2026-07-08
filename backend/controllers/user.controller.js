import userModel from "../models/user.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import { internalServerErrorResponse } from "../utils/response.handler.js";
import { sendCookieToUser } from "../utils/send.cookie.js";

export const userController = async (req, res) => {
    try {
        const { employeeId, name, email, password, role, phoneNumber, designation, department } = req.body;


    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};