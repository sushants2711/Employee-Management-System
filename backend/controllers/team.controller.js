import teamModel from "../models/team.model.js";
import userModel from "../models/user.model.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";
import departmentModel from "../models/department.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";

// create team controller
export const createTeamController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const {
      teamName,
      teamLead,
      manager,
      teamDescription,
      department,
      members,
    } = req.body;

    const isVerifyTeamLead = verifyMongoDBId(teamLead, res);

    if (isVerifyTeamLead !== true) return isVerifyTeamLead;

    const isVerifyManager = verifyMongoDBId(manager, res);

    if (isVerifyManager !== true) return isVerifyManager;

    const isVerifyDepartment = verifyMongoDBId(department, res);

    if (isVerifyDepartment !== true) return isVerifyDepartment;

    if (members) {
      if (!Array.isArray(members)) {
        return badRequestResponse(res, "Members must be an array of IDs");
      }

      for (const curr of members) {
        const isValidMember = verifyMongoDBId(curr, res);
        if (isValidMember !== true) return isValidMember;
      }
    }

    const teamExist = await teamModel.findOne({ teamName });

    if (teamExist) return badRequestResponse(res, "Team name already exist");

    const userExist = await userModel.findById(teamLead);

    if (!userExist) return badRequestResponse(res, "User not exist");

    if (userExist.role !== "Team Leader")
      return badRequestResponse(res, "User is not a Team Leader");

    const managerExist = await userModel.findById(manager);

    if (!managerExist) return badRequestResponse(res, "Manager not exist");

    if (managerExist.role !== "Manager")
      return badRequestResponse(res, "User is not a Manager");

    const departmentExist = await departmentModel.findById(department);

    if (!departmentExist)
      return badRequestResponse(res, "Department not exist");

    if (members) {
      for (const curr of members) {
        const memberExist = await userModel.findById(curr);

        if (!memberExist) return badRequestResponse(res, "User not exist");

        if (memberExist.role !== "Employee")
          return badRequestResponse(res, "User is not an Employee");
      }
    }

    // --- Active Team Validation ---
    const usersToCheck = [teamLead, manager, ...(members || [])];
    const activeTeamConflict = await teamModel.findOne({
      status: "ACTIVE",
      $or: [
        { teamLead: { $in: usersToCheck } },
        { manager: { $in: usersToCheck } },
        { members: { $in: usersToCheck } },
      ],
    });

    if (activeTeamConflict) {
      return badRequestResponse(
        res,
        `One or more selected users are already assigned to an active team (${activeTeamConflict.teamName})`
      );
    }

    const team = await teamModel.create({
      teamName,
      teamLead,
      manager,
      teamDescription,
      department,
      members,
      createdBy: loggedInUserId,
    });

    return createdResponse(res, "Team created successfully", team);
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
    const { search, status } = req.query;

    let filterData = {};

    if (search) {
      filterData.$or = [{ teamName: { $regex: search, $options: "i" } }];
    }
    if (status) filterData.status = status;

    const team = await teamModel
      .find(filterData)
      .populate("department", "departmentName departmentCode status")
      .populate("teamLead", "name email role")
      .populate("manager", "name email role")
      .populate("createdBy", "name email role")
      .populate({
        path: "members",
        select: "name email role employeeId designation department",
        populate: [
          { path: "designation", select: "designationName" },
          { path: "department", select: "departmentName" },
        ],
      });

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
      .populate("createdBy", "name email role")
      .populate({
        path: "members",
        select: "name email role employeeId designation department",
        populate: [
          { path: "designation", select: "designationName" },
          { path: "department", select: "departmentName" },
        ],
      });

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

    const {
      teamName,
      teamLead,
      manager,
      teamDescription,
      status,
      department,
      members,
    } = req.body;

    // --- 1. Verify all provided MongoDB IDs first ---
    const isValidId = verifyMongoDBId(id, res);
    if (isValidId !== true) return badRequestResponse(res, "Invalid team ID");

    if (department) {
      const isValidDepartment = verifyMongoDBId(department, res);
      if (isValidDepartment !== true)
        return badRequestResponse(res, "Invalid department ID");
    }

    if (teamLead) {
      const isValidTeamLead = verifyMongoDBId(teamLead, res);
      if (isValidTeamLead !== true)
        return badRequestResponse(res, "Invalid team lead ID");
    }

    if (manager) {
      const isValidManager = verifyMongoDBId(manager, res);
      if (isValidManager !== true)
        return badRequestResponse(res, "Invalid manager ID");
    }

    if (members) {
      if (!Array.isArray(members)) {
        return badRequestResponse(res, "Members must be an array of IDs");
      }
      for (const curr of members) {
        const isValidMember = verifyMongoDBId(curr, res);
        if (isValidMember !== true) return isValidMember;
      }
    }

    // --- 2. Perform Database Validation Queries ---
    const singleTeam = await teamModel.findById(id);
    if (!singleTeam) {
      return notFoundResponse(res, "Team not found");
    }

    if (department) {
      const departmentExist = await departmentModel.findById(department);
      if (!departmentExist)
        return badRequestResponse(res, "Department not exist");
    }

    if (teamLead) {
      const teamLeadExist = await userModel.findById(teamLead);
      if (!teamLeadExist) return badRequestResponse(res, "Team lead not exist");

      if (teamLeadExist.role !== "Team Leader")
        return badRequestResponse(res, "User is not a Team Leader");
    }

    if (manager) {
      const managerExist = await userModel.findById(manager);
      if (!managerExist) return badRequestResponse(res, "Manager not exist");

      if (managerExist.role !== "Manager")
        return badRequestResponse(res, "User is not a Manager");
    }

    if (members) {
      for (const curr of members) {
        const memberExist = await userModel.findById(curr);
        if (!memberExist) return badRequestResponse(res, "Member not exist");

        if (memberExist.role !== "Employee")
          return badRequestResponse(res, "User is not an Employee");
      }
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

    // --- Active Team Validation ---
    const usersToCheck = [
      teamLead ?? singleTeam.teamLead,
      manager ?? singleTeam.manager,
      ...((members ?? singleTeam.members) || []),
    ].filter(Boolean);

    const activeTeamConflict = await teamModel.findOne({
      _id: { $ne: id },
      status: "ACTIVE",
      $or: [
        { teamLead: { $in: usersToCheck } },
        { manager: { $in: usersToCheck } },
        { members: { $in: usersToCheck } },
      ],
    });

    if (activeTeamConflict) {
      return badRequestResponse(
        res,
        `One or more selected users are already assigned to another active team (${activeTeamConflict.teamName})`
      );
    }

    const updateDataGrounp = {
      teamName: teamName ?? singleTeam.teamName,
      teamLead: teamLead ?? singleTeam.teamLead,
      manager: manager ?? singleTeam.manager,
      teamDescription: teamDescription ?? singleTeam.teamDescription,
      status: status ?? singleTeam.status,
      department: department ?? singleTeam.department,
      members: members ?? singleTeam.members,
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

    if (!deleteData)
      return badRequestResponse(res, "Error occur to delete the team");

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
      .populate("createdBy", "name email role")
      .populate({
        path: "members",
        select: "name email role employeeId designation department",
        populate: [
          { path: "designation", select: "designationName" },
          { path: "department", select: "departmentName" },
        ],
      });

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
