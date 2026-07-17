import departmentModel from "../models/department.model.js";
import designationModel from "../models/designation.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create designation controller
export const createDesignationController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { designationName, designationCode, description, department } =
      req.body;

    const isValid = verifyMongoDBId(department, res);

    if (isValid !== true) return;

    const departmentExist = await departmentModel.findById(department);

    if (!departmentExist) {
      return notFoundResponse(res, "Department not found");
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
      department,
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

    const designation = await designationModel
      .find(filterData)
      .populate("department", "departmentName departmentCode");

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

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const singleDesignation = await designationModel
      .findById(id)
      .populate("department", "departmentName departmentCode");

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

    const {
      designationName,
      designationCode,
      description,
      status,
      department,
    } = req.body;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const result = verifyMongoDBId(department, res);

    if (result !== true) return;

    const singleDesignation = await designationModel.findById(id);

    if (!singleDesignation) {
      return notFoundResponse(res, "Designation not found");
    }

    if (department) {
      const departmentExist = await departmentModel.findById(department);

      if (!departmentExist) {
        return notFoundResponse(res, "Department not found");
      }
    }

    const updateDataGrounp = {
      designationName: designationName ?? singleDesignation.designationName,
      designationCode: designationCode ?? singleDesignation.designationCode,
      description: description ?? singleDesignation.description,
      createdBy: loggedInUser._id ?? singleDesignation.createdBy,
      status: status ?? singleDesignation.status,
      department: department ?? singleDesignation.department,
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

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

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
