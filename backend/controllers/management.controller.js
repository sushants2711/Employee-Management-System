import managementModel from "../models/management.model.js";
// import { verifyPassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
} from "../utils/response.handler.js";
import { sendCookieToUser } from "../utils/send.cookie.js";

export const signupManagement = async (req, res) => {
  try {
    const { managementKey, managementPassword } = req.body;

    const totalData = await managementModel.countDocuments({});

    if (totalData > 5) {
      return badRequestResponse(res, "Too many managements are registered");
    }

    const password = hashPassword(managementPassword);

    const newManagement = new managementModel({
      managementKey,
      managementPassword: password,
    });

    const savedData = await newManagement.save().select("-managementPassword");

    // send a cookie
    try {
      await sendCookieToUser(savedData._id, res);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Internal Server Error",
        error.message
      );
    }

    return createdResponse(
      res,
      "Management registered successfully",
      savedData
    );
  } catch (error) {
    return internalServerErrorResponse(
      error,
      "Internal Server Error",
      error.message
    );
  }
};
