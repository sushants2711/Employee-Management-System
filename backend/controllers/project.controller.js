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
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create project
export const createProjectController = async (req, res) => {
  try {
    const { projectName, description, teamName, startDate, endDate } = req.body;

    const loggedInUser = req.user.id;

    if (!loggedInUser) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    const isVerifyTeam = verifyMongoDBId(teamName, res);
    if (isVerifyTeam !== true) return isVerifyTeam;

    const projectExist = await projectModel.findOne({ projectName });

    if (projectExist) {
      return badRequestResponse(res, "Project already exist");
    }

    const teamExist = await teamModel.findById(teamName);

    if (!teamExist) {
      return notFoundResponse(res, "Team not found");
    }

    const project = await projectModel.create({
      projectName,
      description,
      teamName,
      startDate,
      endDate,
      assignBy: loggedInUser,
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
    const { status, teamName, assignBy, isActive, startDate, endDate, search } =
      req.query;

    let filterData = {};

    if (status) filterData.status = status;
    if (teamName) filterData.teamName = teamName;
    if (assignBy) filterData.assignBy = assignBy;
    if (isActive) filterData.isActive = isActive;
    if (startDate) filterData.startDate = startDate;
    if (endDate) filterData.endDate = endDate;
    if (search) {
      filterData.$or = [{ projectName: { $regex: search, $options: "i" } }];
    }

    const projects = await projectModel
      .find(filterData)
      .populate({
        path: "teamName",
        select: "teamName status manager teamLead",
        populate: [
          { path: "manager", select: "name email role" },
          { path: "teamLead", select: "name email role" },
        ],
      })
      .populate("assignBy", "name email role");

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

    const isValidId = verifyMongoDBId(id, res);
    if (isValidId !== true) return isValidId;

    const project = await projectModel
      .findById(id)
      .populate({
        path: "teamName",
        select: "teamName status manager teamLead",
        populate: [
          { path: "manager", select: "name email role" },
          { path: "teamLead", select: "name email role" },
        ],
      })
      .populate("assignBy", "name email role");

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
      startDate,
      endDate,
      status,
      assignBy,
    } = req.body;

    const loggedInUser = req.user.id;

    const isValidId = verifyMongoDBId(id, res);
    if (isValidId !== true) return isValidId;

    if (teamName) {
      const isValidTeam = verifyMongoDBId(teamName, res);
      if (isValidTeam !== true) return isValidTeam;
    }

    if (!loggedInUser) {
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

    if (projectExist.assignBy.toString() !== loggedInUser.toString()) {
      return unauthorizedResponse(
        res,
        "Unauthorized",
        "You are not authorized to perform this action"
      );
    }

    if (projectName) {
      const projectNameExist = await projectModel.findOne({
        projectName,
        _id: { $ne: id },
      });
      if (projectNameExist) {
        return badRequestResponse(res, "Project name already exist");
      }
    }

    if (teamName) {
      const teamExist = await teamModel.findById(teamName);
      if (!teamExist) return badRequestResponse(res, "Team not found");
    }

    const updateDataGroup = {
      projectName: projectName ?? projectExist.projectName,
      description: description ?? projectExist.description,
      teamName: teamName ?? projectExist.teamName,
      startDate: startDate ?? projectExist.startDate,
      endDate: endDate ?? projectExist.endDate,
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

    const isValidId = verifyMongoDBId(id, res);
    if (isValidId !== true) return isValidId;

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
