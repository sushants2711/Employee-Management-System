import mongoose from "mongoose";
import departmentModel from "../models/department.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";

// create a department
export const createDepartmentController = async (req, res) => {
  try {
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
    const allDepartment = await departmentModel.find();

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

    if (!id) {
      return badRequestResponse(res, "Department ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid department ID");
    }

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

// update the department
export const updateTheDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;

    const { departmentName, departmentCode, description, status } = req.body;

    if (!id) {
      return badRequestResponse(res, "Department ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid department ID");
    }

    const singleDepartment = await departmentModel.findById(id);

    if (!singleDepartment) {
      return notFoundResponse(res, "Department not found");
    }

    const updateDataGrounp = {
      departmentName: departmentName ?? singleDepartment.departmentName,
      departmentCode: departmentCode ?? singleDepartment.departmentCode,
      description: description ?? singleDepartment.description,
      status: status ?? singleDepartment.status,
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
export const deleteTheDepartmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Department ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid department ID");
    }

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

// get all active department
export const getAllActiveDepartmentController = async (req, res) => {
  try {
    const activeDepartment = await departmentModel.find({ status: "ACTIVE" });

    if (
      !activeDepartment ||
      activeDepartment.length === 0 ||
      !Array.isArray(activeDepartment)
    ) {
      return notFoundResponse(res, "No active department found");
    }

    return successResponse(
      res,
      "Active department fetched successfully",
      activeDepartment
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get all inActive department
export const getAllInactiveDepartmentController = async (req, res) => {
  try {
    const inActiveDepartment = await departmentModel.find({
      status: "INACTIVE",
    });

    if (
      !inActiveDepartment ||
      inActiveDepartment.length === 0 ||
      !Array.isArray(inActiveDepartment)
    ) {
      return notFoundResponse(res, "No inactive department found");
    }

    return successResponse(
      res,
      "Inactive department fetched successfully",
      inActiveDepartment
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
