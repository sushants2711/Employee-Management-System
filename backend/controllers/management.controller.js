import managementModel from "../models/management.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
} from "../utils/response.handler.js";
import { sendCookieToUser } from "../utils/send.cookie.js";

// management signup
export const signupManagementController = async (req, res) => {
  try {
    const { managementKey, managementPassword } = req.body;

    const totalData = await managementModel.countDocuments({});

    if (totalData > 5) {
      return badRequestResponse(res, "Too many managements are registered");
    }

    const password = await hashPassword(managementPassword);

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

// management login
export const loginManagement = async (req, res) => {
  try {
    const { managementKey, managementPassword } = req.body;

    const management = await managementModel.findOne({ managementKey });

    if (!management) {
      return badRequestResponse(res, "Invalid credentials");
    }

    const isPasswordValid = await verifyPassword(
      managementPassword,
      management.managementPassword
    );

    if (!isPasswordValid) {
      return badRequestResponse(res, "Invalid credentials");
    }

    // send a cookie
    try {
      await sendCookieToUser(management._id, res);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Internal Server Error",
        error.message
      );
    }

    const managementData = {
      _id: management._id,
      managementKey: management.managementKey,
    };

    return successResponse(
      res,
      "Management logged in successfully",
      managementData
    );
  } catch (error) {
    return internalServerErrorResponse(
      error,
      "Internal Server Error",
      error.message
    );
  }
};
