import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";
import teamModel from "../models/team.model.js";
import userModel from "../models/user.model.js";
import {
  internalServerErrorResponse,
  createdResponse,
  badRequestResponse,
  successResponse,
  notFoundResponse,
} from "../utils/response.handler.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";

// create task controller
export const createTaskController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const {
      taskName,
      description,
      project, // mongo id
      team, // mongo id
      assignedTo, // mongo id
      priority,
      startDate,
      dueDate,
      remarks,
    } = req.body;

    // verify IDs
    const isProjectValid = verifyMongoDBId(project, res);
    if (isProjectValid !== true) return isProjectValid;

    const isTeamValid = verifyMongoDBId(team, res);
    if (isTeamValid !== true) return isTeamValid;

    const isAssignedToValid = verifyMongoDBId(assignedTo, res);
    if (isAssignedToValid !== true) return isAssignedToValid;

    // check if referenced entities exist
    const projectExist = await projectModel.findById(project);
    if (!projectExist) {
      return notFoundResponse(res, "Project not found");
    }

    const teamExist = await teamModel.findById(team);
    if (!teamExist) {
      return notFoundResponse(res, "Team not found");
    }

    const userExist = await userModel.findById(assignedTo);
    if (!userExist) {
      return notFoundResponse(res, "Assigned user not found");
    }

    if (userExist.role === "Management")
      return badRequestResponse(res, "You cannot assign task to management");

    if (projectExist.teamName.toString() !== team) {
      return badRequestResponse(
        res,
        "The selected team is not assigned to this project"
      );
    }

    const isUserInTeam =
      teamExist.members.some(
        (memberId) => memberId.toString() === assignedTo
      ) ||
      teamExist.teamLead.toString() === assignedTo ||
      teamExist.manager.toString() === assignedTo;

    if (!isUserInTeam) {
      return badRequestResponse(
        res,
        "Assigned user is not part of the team working on this project"
      );
    }

    const taskNameExist = await taskModel.findOne({ taskName, project });
    if (taskNameExist) {
      return badRequestResponse(
        res,
        "Task with this name already exists in this project"
      );
    }

    const task = new taskModel({
      taskName,
      description,
      project,
      team,
      assignedTo,
      assignedBy: loggedInUser._id,
      priority,
      startDate,
      dueDate,
      remarks,
    });

    const saveData = await task.save();

    return createdResponse(res, "Task created successfully", saveData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get task controller
export const getTaskController = async (req, res) => {
  try {
    const { search, status, priority, project, team, assignedTo } = req.query;

    let filterData = {};

    if (search) {
      filterData.taskName = { $regex: search, $options: "i" };
    }
    if (status) filterData.status = status;
    if (priority) filterData.priority = priority;
    if (project) filterData.project = project;
    if (team) filterData.team = team;
    if (assignedTo) filterData.assignedTo = assignedTo;

    const tasks = await taskModel
      .find(filterData)
      .populate("project", "projectName projectCode")
      .populate("team", "teamName teamCode")
      .populate("assignedTo", "firstName lastName email")
      .populate("assignedBy", "firstName lastName email");

    if (!tasks || tasks.length === 0 || !Array.isArray(tasks)) {
      return notFoundResponse(res, "No task found");
    }

    return successResponse(res, "Tasks fetched successfully", tasks);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get single task controller
export const getSingleTaskController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);
    if (isValid !== true) return;

    const singleTask = await taskModel
      .findById(id)
      .populate("project", "projectName projectCode")
      .populate("team", "teamName teamCode")
      .populate("assignedTo", "firstName lastName email")
      .populate("assignedBy", "firstName lastName email");

    if (!singleTask) {
      return notFoundResponse(res, "Task not found");
    }

    return successResponse(res, "Task fetched successfully", singleTask);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update task controller
export const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      taskName,
      description,
      project,
      team,
      assignedTo,
      status,
      priority,
      startDate,
      dueDate,
      remarks,
    } = req.body;

    const isValid = verifyMongoDBId(id, res);
    if (isValid !== true) return isValid;

    if (project) {
      const isProjectValid = verifyMongoDBId(project, res);
      if (isProjectValid !== true) return isProjectValid;
    }

    if (team) {
      const isTeamValid = verifyMongoDBId(team, res);
      if (isTeamValid !== true) return isTeamValid;
    }

    if (assignedTo) {
      const isAssignedToValid = verifyMongoDBId(assignedTo, res);
      if (isAssignedToValid !== true) return isAssignedToValid;
    }

    const singleTask = await taskModel.findById(id);

    if (!singleTask) {
      return notFoundResponse(res, "Task not found");
    }

    if (project) {
      const projectExist = await projectModel.findById(project);
      if (!projectExist) return notFoundResponse(res, "Project not found");
    }

    if (team) {
      const teamExist = await teamModel.findById(team);
      if (!teamExist) return notFoundResponse(res, "Team not found");
    }

    if (assignedTo) {
      const userExist = await userModel.findById(assignedTo);
      if (!userExist) return notFoundResponse(res, "Assigned user not found");
    }

    const updateDataGroup = {
      taskName: taskName ?? singleTask.taskName,
      description: description ?? singleTask.description,
      project: project ?? singleTask.project,
      team: team ?? singleTask.team,
      assignedTo: assignedTo ?? singleTask.assignedTo,
      status: status ?? singleTask.status,
      priority: priority ?? singleTask.priority,
      startDate: startDate ?? singleTask.startDate,
      dueDate: dueDate ?? singleTask.dueDate,
      remarks: remarks ?? singleTask.remarks,
    };

    // If status is being updated to COMPLETED, update completedAt
    if (status === "COMPLETED" && singleTask.status !== "COMPLETED") {
      updateDataGroup.completedAt = new Date();
    } else if (status && status !== "COMPLETED") {
      updateDataGroup.completedAt = null;
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { $set: updateDataGroup },
      { new: true }
    );

    if (!updatedTask) {
      return badRequestResponse(res, "Failed to update task");
    }

    return successResponse(res, "Task updated successfully", updatedTask);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// delete task controller
export const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;

    const isValid = verifyMongoDBId(id, res);
    if (isValid !== true) return;

    const singleTask = await taskModel.findById(id);

    if (!singleTask) {
      return notFoundResponse(res, "Task not found");
    }

    const deleteData = await taskModel.findByIdAndDelete(id);

    return successResponse(res, "Task deleted successfully", deleteData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
