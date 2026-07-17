import departmentModel from "../models/department.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create a department
export const createDepartmentController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { departmentName, departmentCode, description } = req.body;

    const departmentNameExist = await departmentModel.findOne({
      departmentName,
    });

    const departmentCodeExist = await departmentModel.findOne({
      departmentCode,
    });

    if (departmentNameExist || departmentCodeExist) {
      return badRequestResponse(res, "Department already exist");
    }

    const department = new departmentModel({
      departmentName,
      departmentCode,
      description: description,
      createdBy: loggedInUser._id,
    });

    const saveData = await department.save();

    return createdResponse(res, "Department created successfully", saveData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get all department
export const getAllDepartmentController = async (req, res) => {
  try {
    const { departmentName, departmentCode, status } = req.query;

    let filterData = {};

    if (departmentName) filterData.departmentName = departmentName;
    if (departmentCode) filterData.departmentCode = departmentCode;
    if (status) filterData.status = status;

    const allDepartment = await departmentModel.find(filterData);

    if (
      !allDepartment ||
      allDepartment.length === 0 ||
      !Array.isArray(allDepartment)
    ) {
      return notFoundResponse(res, "No department found");
    }

    return successResponse(
      res,
      "Department fetched successfully",
      allDepartment
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get single department
export const getSingleDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const singleDepartment = await departmentModel.findById(id);

    if (!singleDepartment) {
      return notFoundResponse(res, "Department not found");
    }

    return successResponse(
      res,
      "Department fetched successfully",
      singleDepartment
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the department - either update the deparment by management or manager that is created that department
// fix the api
export const updateTheDepartmentController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { id } = req.params;

    const { departmentName, departmentCode, description, status } = req.body;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const singleDepartment = await departmentModel.findById(id);

    if (!singleDepartment) {
      return notFoundResponse(res, "Department not found");
    }

    const updateDataGrounp = {
      departmentName: departmentName ?? singleDepartment.departmentName,
      departmentCode: departmentCode ?? singleDepartment.departmentCode,
      description: description ?? singleDepartment.description,
      status: status ?? singleDepartment.status,
      createdBy: loggedInUser._id ?? singleDepartment.createdBy,
    };

    const updatedDepartment = await departmentModel.findByIdAndUpdate(
      id,
      { $set: updateDataGrounp }, //{updateDataGroup}
      { new: true }
    );

    if (!updatedDepartment) {
      return badRequestResponse(res, "Failed to update department");
    }

    return successResponse(
      res,
      "Department updated successfully",
      updatedDepartment
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete the department
// only delete the department either manager that is created or the one who is in management
export const deleteTheDepartmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);

    if (!isValid) return isValid;

    const singleDepartment = await departmentModel.findById(id);

    if (!singleDepartment) {
      return notFoundResponse(res, "Department not found");
    }

    const deleteData = await departmentModel.findByIdAndDelete(id);

    return successResponse(res, "Department deleted successfully", deleteData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get all active
export const getAllActiveDepartmentController = async (req, res) => {
  try {
    const allDepartments = await departmentModel.find({ status: "ACTIVE" });

    if (
      !allDepartments ||
      allDepartments.length === 0 ||
      !Array.isArray(allDepartments)
    ) {
      return notFoundResponse(res, "No active department found");
    }

    return successResponse(
      res,
      "Active departments fetched successfully",
      allDepartments
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
