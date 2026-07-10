import mongoose from "mongoose";
import teamModel from "../models/team.model.js";
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
    const { teamName, teamLead, manager, teamDescription } = req.body;

    const teamNameExist = await teamModel.findOne({ teamName });

    if (teamNameExist) {
      return badRequestResponse(res, "Team already exist");
    }

    const team = new teamModel({
      teamName,
      teamLead,
      manager,
      teamDescription,
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
    const team = await teamModel.find();

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

    if (!id) {
      return badRequestResponse(res, "Team ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid team ID");
    }

    const singleTeam = await teamModel.findById(id);

    if (!singleTeam) {
      return notFoundResponse(res, "Team not found");
    }

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

    const { teamName, teamLead, manager, teamDescription, isActive } = req.body;

    if (!id) {
      return badRequestResponse(res, "Team ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid team ID");
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
      isActive: isActive ?? singleTeam.isActive,
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

    if (!id) {
      return badRequestResponse(res, "Team ID is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid team ID");
    }

    const singleTeam = await teamModel.findById(id);

    if (!singleTeam) {
      return notFoundResponse(res, "Team not found");
    }

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
    const team = await teamModel.find({ isActive: true });

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

// all inactive team controller
export const allInactiveTeamController = async (req, res) => {
  try {
    const team = await teamModel.find({ isActive: false });

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
