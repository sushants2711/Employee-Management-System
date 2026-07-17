import mongoose from "mongoose";
import designationModel from "../models/designation.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../utils/response.handler.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create designation controller
export const createDesignationController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { designationName, designationCode, description } = req.body;

    const isValid = verifyMongoDBId(loggedInUser._id, res);

    if (!isValid) return isValid;

    if (loggedInUser.role !== "Management") {
      return unauthorizedResponse(
        res,
        "You are not authorized to create designation"
      );
    }

    const designationNameExist = await designationModel.findOne({
      designationName,
    });

    const designationCodeExist = await designationModel.findOne({
      designationCode,
    });

    if (designationNameExist || designationCodeExist) {
      return badRequestResponse(res, "Designation already exist");
    }

    const designation = new designationModel({
      designationName,
      designationCode,
      description,
      createdBy: loggedInUser._id,
    });

    const saveData = await designation.save();

    return createdResponse(res, "Designation created successfully", saveData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get designation controller
export const getDesignationController = async (req, res) => {
  try {
    const { designationName, designationCode } = req.query;

    let filterData = {};

    if (designationName) filterData.designationName = designationName;
    if (designationCode) filterData.designationCode = designationCode;

    const designation = await designationModel.find(filterData);

    if (
      !designation ||
      designation.length === 0 ||
      !Array.isArray(designation)
    ) {
      return notFoundResponse(res, "No designation found");
    }

    return successResponse(
      res,
      "Designation fetched successfully",
      designation
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get single designation controller
export const getSingleDesignationController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Designation ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid designation ID");
    }

    const singleDesignation = await designationModel.findById(id);

    if (!singleDesignation) {
      return notFoundResponse(res, "Designation not found");
    }

    return successResponse(
      res,
      "Designation fetched successfully",
      singleDesignation
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update designation controller
export const updateDesignationController = async (req, res) => {
  try {
    const { id } = req.params;

    const loggedInUser = req.user;

    const { designationName, designationCode, description } = req.body;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (!result) return result;

    const singleDesignation = await designationModel.findById(id);

    if (!singleDesignation) {
      return notFoundResponse(res, "Designation not found");
    }

    if (loggedInUser.role !== "Management") {
      return unauthorizedResponse(
        res,
        "You are not authorized to update this designation"
      );
    }

    const updateDataGrounp = {
      designationName: designationName ?? singleDesignation.designationName,
      designationCode: designationCode ?? singleDesignation.designationCode,
      description: description ?? singleDesignation.description,
      createdBy: loggedInUser._id ?? singleDesignation.createdBy,
    };

    const updatedDesignation = await designationModel.findByIdAndUpdate(
      id,
      { $set: updateDataGrounp }, //{updateDataGroup}
      { new: true }
    );

    if (!updatedDesignation) {
      return badRequestResponse(res, "Failed to update designation");
    }

    return successResponse(
      res,
      "Designation updated successfully",
      updatedDesignation
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete designation controller
export const deleteDesignationController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (!result) return result;

    if (loggedInUser.role !== "Management") {
      return unauthorizedResponse(
        res,
        "You are not authorized to delete this designation"
      );
    }

    const singleDesignation = await designationModel.findById(id);

    if (!singleDesignation) {
      return notFoundResponse(res, "Designation not found");
    }

    const deleteData = await designationModel.findByIdAndDelete(id);

    return successResponse(res, "Designation deleted successfully", deleteData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
