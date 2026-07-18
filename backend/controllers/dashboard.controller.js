import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import Department from "../models/department.model.js";
import Designation from "../models/designation.model.js";
import Project from "../models/project.model.js";
import Performance from "../models/performance.model.js";
import {
  successResponse,
  internalServerErrorResponse,
} from "../utils/response.handler.js";

export const allDetailsController = async (req, res) => {
  try {
    // 1. Hierarchy - Fetch users based on roles
    const management = await User.find({ role: "Management" }).select(
      "-password"
    );
    const managers = await User.find({ role: "Manager" }).select("-password");
    const teamLeaders = await User.find({ role: "Team Leader" }).select(
      "-password"
    );
    const employees = await User.find({ role: "Employee" }).select("-password");

    const hierarchy = {
      management: { count: management.length, data: management },
      managers: { count: managers.length, data: managers },
      teamLeaders: { count: teamLeaders.length, data: teamLeaders },
      employees: { count: employees.length, data: employees },
    };

    // 2. Teams, Departments, Designations
    const teams = await Team.find()
      .populate("teamLead", "name email role")
      .populate("manager", "name email role")
      .populate("members", "name email role");
    const departments = await Department.find();
    const designations = await Designation.find().populate(
      "department",
      "departmentName"
    );

    const organization = {
      teams: { count: teams.length, data: teams },
      departments: { count: departments.length, data: departments },
      designations: { count: designations.length, data: designations },
    };

    // 3. Projects that are completed right now
    const completedProjects = await Project.find({ status: "COMPLETED" })
      .populate("teamName", "teamName")
      .populate("manager", "name email")
      .populate("teamLeader", "name email")
      .sort({ completedAt: -1 });

    // 4. Feedback (Performance reviews)
    const feedback = await Performance.find()
      .populate("employee", "name email")
      .populate("project", "projectName")
      .populate("team", "teamName")
      .populate("reviewedBy", "name email")
      .sort({ reviewDate: -1 });

    const dashboardData = {
      hierarchy,
      organization,
      completedProjects: {
        count: completedProjects.length,
        data: completedProjects,
      },
      recentFeedback: { count: feedback.length, data: feedback },
    };

    return successResponse(
      res,
      "Dashboard details fetched successfully",
      dashboardData
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
