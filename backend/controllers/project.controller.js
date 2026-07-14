import mongoose from "mongoose";
import projectModel from "../models/project.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../utils/response.handler.js";
import teamModel from "../models/team.model.js";
import userModel from "../models/user.model.js";

// create project
export const createProjectController = async (req, res) => {
  try {
    const {
      projectName,
      description,
      teamName,
      manager,
      teamLeader,
      startDate,
      endDate,
      members,
    } = req.body;

    const loggedInUser = req.user.id;

    if (!loggedInUser) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    const projectExist = await projectModel.findOne({ projectName });

    if (projectExist) {
      return badRequestResponse(res, "Project already exist");
    }

    const teamExist = await teamModel.findById(teamName);

    if (!teamExist) {
      return notFoundResponse(res, "Team not found");
    }

    if (teamExist.manager !== manager) {
      return badRequestResponse(res, "Manager is not a manager of this team");
    }

    if (teamExist.teamLead !== teamLeader) {
      return badRequestResponse(
        res,
        "Team Leader is not a team leader of this team"
      );
    }

    // check all the members exist in the database
    const membersExist = await userModel.find({ _id: { $in: members } });

    if (membersExist.length !== members.length) {
      return notFoundResponse(res, "Some members not found");
    }

    // check all the members are active
    const activeMembers = membersExist.filter(
      (member) => member.status === "ACTIVE"
    );

    if (activeMembers.length !== members.length) {
      return badRequestResponse(res, "Some members are not active");
    }

    const project = await projectModel.create({
      projectName,
      description,
      teamName,
      manager,
      teamLeader,
      startDate,
      endDate,
      assignBy: loggedInUser,
      members,
    });

    return createdResponse(res, "Project created successfully", project);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get all project
export const getAllProjectController = async (req, res) => {
  try {
    const {
      status,
      teamName,
      manager,
      teamLeader,
      member,
      assignBy,
      isActive,
      startDate,
      endDate,
      projectName,
    } = req.query;

    let filterData = {};

    if (status) filterData.status = status;
    if (teamName) filterData.teamName = teamName;
    if (manager) filterData.manager = manager;
    if (teamLeader) filterData.teamLeader = teamLeader;
    if (member) filterData.member = member;
    if (assignBy) filterData.assignBy = assignBy;
    if (isActive) filterData.isActive = isActive;
    if (startDate) filterData.startDate = startDate;
    if (endDate) filterData.endDate = endDate;
    if (projectName) filterData.projectName = projectName;

    const projects = await projectModel.find(filterData);

    if (!projects || projects.length === 0 || !Array.isArray(projects)) {
      return notFoundResponse(res, "No projects found");
    }

    return successResponse(res, "Projects fetched successfully", projects);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get project by single
export const getSingleProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Project ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid project ID");
    }

    const project = await projectModel.findById(id);

    if (!project) {
      return notFoundResponse(res, "Project not found");
    }

    return successResponse(res, "Project fetched successfully", project);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the project
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      projectName,
      description,
      teamName,
      manager,
      teamLeader,
      startDate,
      endDate,
      members,
      status,
      assignBy,
    } = req.body;

    const loggedInUser = req.user.id;

    if (!id) {
      return badRequestResponse(res, "Project ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid project ID");
    }

    if (!loggedInUser) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(loggedInUser)) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    const projectExist = await projectModel.findById(id);

    if (!projectExist) {
      return notFoundResponse(res, "Project not found");
    }

    if (projectExist.assignBy !== loggedInUser) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    const updateDataGroup = {
      projectName: projectName ?? projectExist.projectName,
      description: description ?? projectExist.description,
      teamName: teamName ?? projectExist.teamName,
      manager: manager ?? projectExist.manager,
      teamLeader: teamLeader ?? projectExist.teamLeader,
      startDate: startDate ?? projectExist.startDate,
      endDate: endDate ?? projectExist.endDate,
      members: members ?? projectExist.members,
      status: status ?? projectExist.status,
      assignBy: assignBy ?? projectExist.assignBy,
    };

    const updateProject = await projectModel.findByIdAndUpdate(
      id,
      { $set: updateDataGroup },
      { new: true }
    );

    if (!updateProject) {
      return badRequestResponse(res, "Failed to update project");
    }

    return successResponse(res, "Project updated successfully", updateProject);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete the project
export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return badRequestResponse(res, "Project ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid project ID");
    }

    const projectExist = await projectModel.findById(id);

    if (!projectExist) {
      return notFoundResponse(res, "Project not found");
    }

    const deleteProject = await projectModel.findByIdAndDelete(id);

    return successResponse(res, "Project deleted successfully", deleteProject);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
