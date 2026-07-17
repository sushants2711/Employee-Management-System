import teamModel from "../models/team.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";
import departmentModel from "../models/department.model.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create team controller
export const createTeamController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const { teamName, teamLead, manager, teamDescription, department } =
      req.body;

    const isValid = verifyMongoDBId(department, res);

    if (isValid !== true)
      return badRequestResponse(res, "Invalid department ID");

    const teamNameExist = await teamModel.findOne({ teamName });

    if (teamNameExist) return badRequestResponse(res, "Team already exist");

    const departmentExist = await departmentModel.findById(department);

    if (!departmentExist)
      return badRequestResponse(res, "Department not exist");

    const team = new teamModel({
      teamName,
      teamLead,
      manager,
      teamDescription,
      createdBy: loggedInUserId,
    });

    const saveData = await team.save();

    return createdResponse(res, "Team created successfully", saveData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get all team controller
export const getAllTeamController = async (req, res) => {
  try {
    const { teamName, teamLead, manager } = req.query;

    let filterData = {};

    if (teamName) filterData.teamName = teamName;
    if (teamLead) filterData.teamLead = teamLead;
    if (manager) filterData.manager = manager;

    const team = await teamModel
      .find(filterData)
      .populate("department", "departmentName departmentCode status")
      .populate("teamLead", "name email role")
      .populate("manager", "name email role")
      .populate("createdBy", "name email role");

    if (!team || team.length === 0 || !Array.isArray(team)) {
      return notFoundResponse(res, "Team not found");
    }

    return successResponse(res, "Team fetched successfully", team);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get single team controller
export const getSingleTeamController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);

    if (isValid !== true) return badRequestResponse(res, "Invalid team ID");

    const singleTeam = await teamModel
      .findById(id)
      .populate("department", "departmentName departmentCode status")
      .populate("teamLead", "name email role")
      .populate("manager", "name email role")
      .populate("createdBy", "name email role");

    if (!singleTeam) return notFoundResponse(res, "Team not found");

    return successResponse(res, "Team fetched successfully", singleTeam);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update team controller
export const updateTeamController = async (req, res) => {
  try {
    const { id } = req.params;

    const { teamName, teamLead, manager, teamDescription, status, department } =
      req.body;

    const isValid = verifyMongoDBId(id, res);

    if (isValid !== true) return badRequestResponse(res, "Invalid team ID");

    if (department) {
      const isValid = verifyMongoDBId(department, res);

      if (isValid !== true)
        return badRequestResponse(res, "Invalid department ID");

      const departmentExist = await departmentModel.findById(department);

      if (!departmentExist)
        return badRequestResponse(res, "Department not exist");
    }

    const singleTeam = await teamModel.findById(id);

    if (!singleTeam) {
      return notFoundResponse(res, "Team not found");
    }

    if (teamName) {
      const teamNameExist = await teamModel.findOne({
        teamName,
        _id: { $ne: id },
      });
      if (teamNameExist) {
        return badRequestResponse(res, "Team name already exist");
      }
    }

    if (teamLead) {
      const teamLeadExist = await teamModel.findOne({
        teamLead,
        _id: { $ne: id },
      });
      if (teamLeadExist) {
        return badRequestResponse(res, "Team lead already exist");
      }
    }

    const updateDataGrounp = {
      teamName: teamName ?? singleTeam.teamName,
      teamLead: teamLead ?? singleTeam.teamLead,
      manager: manager ?? singleTeam.manager,
      teamDescription: teamDescription ?? singleTeam.teamDescription,
      status: status ?? singleTeam.status,
      department: department ?? singleTeam.department,
    };

    const updatedTeam = await teamModel.findByIdAndUpdate(
      id,
      { $set: updateDataGrounp },
      { new: true }
    );

    if (!updatedTeam) {
      return badRequestResponse(res, "Failed to update team");
    }

    return successResponse(res, "Team updated successfully", updatedTeam);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete team controller
export const deleteTeamController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);

    if (isValid !== true) return badRequestResponse(res, "Invalid team ID");

    const singleTeam = await teamModel.findById(id);

    if (!singleTeam) return notFoundResponse(res, "Team not found");

    const deleteData = await teamModel.findByIdAndDelete(id);

    return successResponse(res, "Team deleted successfully", deleteData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// all active team controller
export const allActiveTeamController = async (req, res) => {
  try {
    const team = await teamModel
      .find({ status: "ACTIVE" })
      .populate("department", "departmentName departmentCode status")
      .populate("teamLead", "name email role")
      .populate("manager", "name email role")
      .populate("createdBy", "name email role");

    if (!team || team.length === 0 || !Array.isArray(team)) {
      return notFoundResponse(res, "Team not found");
    }

    return successResponse(res, "Team fetched successfully", team);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
