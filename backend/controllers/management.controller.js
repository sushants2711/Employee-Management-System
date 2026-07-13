import mongoose from "mongoose";
import managementModel from "../models/management.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  unauthorizedResponse,
} from "../utils/response.handler.js";
import { sendCookieToUser } from "../utils/send.cookie.js";

// management signup via send email
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
export const loginManagementController = async (req, res) => {
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

// get single management by id details
export const getSingleManagementByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Management ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid management ID");
    }

    const management = await managementModel
      .findById(id)
      .select("-managementPassword");

    if (!management) {
      return badRequestResponse(res, "Management not found");
    }

    return successResponse(res, "Management found successfully", management);
  } catch (error) {
    return internalServerErrorResponse(
      error,
      "Internal Server Error",
      error.message
    );
  }
};

// update the manager credentials
// export const updateFullCredentialsController = async (req, res) => {
//   try {
//   } catch (error) {
//     return internalServerErrorResponse(
//       res,
//       "Internal Server Error",
//       error.message
//     );
//   }
// };

// update the manager password credentials
export const updatePasswordCredentialsController = async (req, res) => {
  try {
    const { id } = req.params;

    const loggedInUser = req.user._id;

    const { oldPassword, password } = req.body;

    if (!id) {
      return badRequestResponse(res, "Management ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid management ID");
    }

    if (!loggedInUser) {
      return unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
      return unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    if (id.toString() !== loggedInUser.toString()) {
      return unauthorizedResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    const findManagement = await managementModel.findById(id);

    if (!findManagement) {
      return badRequestResponse(res, "Management not found");
    }

    const isPasswordValid = await verifyPassword(
      oldPassword,
      findManagement.managementPassword
    );

    if (!isPasswordValid) {
      return badRequestResponse(res, "Invalid credentials");
    }

    const hashedPassword = await hashPassword(password);

    const updatedData = await managementModel
      .findByIdAndUpdate(
        id,
        { managementPassword: hashedPassword },
        { new: true }
      )
      .select("-managementPassword");

    if (!updatedData) {
      return badRequestResponse(res, "Failed to update password");
    }

    return successResponse(res, "Password updated successfully", updatedData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete the manager credentials
// export const deleteManagerController = async (req, res) => {
//   try {
//   } catch (error) {
//     return internalServerErrorResponse(
//       res,
//       "Internal Server Error",
//       error.message
//     );
//   }
// };
