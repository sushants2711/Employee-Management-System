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

// get available teams for project assignment
export const getAvailableTeamsController = async (req, res) => {
  try {
    const { currentProjectId } = req.query;

    // 1. Get all incomplete projects
    const filter = { status: { $ne: "COMPLETED" } };
    if (currentProjectId) {
      filter._id = { $ne: currentProjectId };
    }
    const incompleteProjects = await projectModel.find(filter, "teamName");
    const busyTeamIds = incompleteProjects.map((p) => p.teamName);

    // 2. Fetch active teams that are not busy
    const availableTeams = await teamModel.find({
      status: "ACTIVE",
      _id: { $nin: busyTeamIds },
    });

    if (!availableTeams) {
      return notFoundResponse(res, "No available teams found");
    }

    return successResponse(
      res,
      "Available teams fetched successfully",
      availableTeams
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

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

    const activeProject = await projectModel.findOne({
      teamName: teamName,
      status: { $ne: "COMPLETED" },
    });

    if (activeProject) {
      return badRequestResponse(
        res,
        `This team is already assigned to an incomplete project: ${activeProject.projectName}`
      );
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

    const loggedInUserRole = req.user.role;
    const loggedInUserId = req.user.id;

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

    // Role-based Access Control for fetching projects
    if (loggedInUserRole !== "Management") {
      // Find all teams where the user is a manager, team lead, or a member
      const userTeams = await teamModel.find(
        {
          $or: [
            { manager: loggedInUserId },
            { teamLead: loggedInUserId },
            { members: loggedInUserId },
          ],
        },
        "_id"
      );

      const teamIds = userTeams.map((t) => t._id);

      // If a specific teamName is requested, ensure the user actually belongs to it
      if (filterData.teamName) {
        if (
          !teamIds.some(
            (id) => id.toString() === filterData.teamName.toString()
          )
        ) {
          return successResponse(res, "Projects fetched successfully", []);
        }
      } else {
        filterData.teamName = { $in: teamIds };
      }
    }

    const projects = await projectModel
      .find(filterData)
      .populate({
        path: "teamName",
        select: "teamName status manager teamLead members",
        populate: [
          { path: "manager", select: "name email role" },
          { path: "teamLead", select: "name email role" },
          { path: "members", select: "name email role" },
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
        select: "teamName status manager teamLead members",
        populate: [
          { path: "manager", select: "name email role" },
          { path: "teamLead", select: "name email role" },
          { path: "members", select: "name email role" },
        ],
      })
      .populate("assignBy", "name email role");

    if (!project) {
      return notFoundResponse(res, "Project not found");
    }

    if (req.user.role !== "Management") {
      const teamId = project.teamName._id;
      const userTeam = await teamModel.findOne({
        _id: teamId,
        $or: [
          { manager: req.user.id },
          { teamLead: req.user.id },
          { members: req.user.id },
        ],
      });

      if (!userTeam) {
        return unauthorizedResponse(
          res,
          "Unauthorized",
          "You do not have access to this project"
        );
      }
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

    // We do not allow updating the assigned team for an existing project.
    // It will always remain the team that was originally assigned.
    const targetTeamId = projectExist.teamName;
    const targetStatus = status || projectExist.status;

    if (targetStatus !== "COMPLETED") {
      const activeProject = await projectModel.findOne({
        teamName: targetTeamId,
        status: { $ne: "COMPLETED" },
        _id: { $ne: id },
      });

      if (activeProject) {
        return badRequestResponse(
          res,
          `This team is already assigned to an incomplete project: ${activeProject.projectName}`
        );
      }
    }

    const updateDataGroup = {
      projectName: projectName ?? projectExist.projectName,
      description: description ?? projectExist.description,
      teamName: projectExist.teamName, // Team cannot be updated
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
