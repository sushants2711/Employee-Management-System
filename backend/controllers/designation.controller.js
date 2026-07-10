import mongoose from "mongoose";
import designationModel from "../models/designation.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";

// create designation controller
export const createDesignationController = async (req, res) => {
  try {
    const { designationName, designationCode, description } = req.body;

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
    const designation = await designationModel.find();

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

    const { designationName, designationCode, description } = req.body;

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

    const updateDataGrounp = {
      designationName: designationName ?? singleDesignation.designationName,
      designationCode: designationCode ?? singleDesignation.designationCode,
      description: description ?? singleDesignation.description,
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
