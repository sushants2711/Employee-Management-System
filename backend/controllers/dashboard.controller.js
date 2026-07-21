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

    // 3. Projects that are completed right now (Detailed List)
    const completedProjects = await Project.find({ status: "COMPLETED" })
      .populate({
        path: "teamName",
        select: "teamName manager teamLead",
        populate: [
          { path: "manager", select: "name email role" },
          { path: "teamLead", select: "name email role" },
        ],
      })
      .sort({ completedAt: -1 });

    // Project Status Aggregation (Counts for all statuses)
    const plannedProjectsCount = await Project.countDocuments({
      status: "PLANNED",
    });
    const inProgressProjectsCount = await Project.countDocuments({
      status: "IN_PROGRESS",
    });
    const onHoldProjectsCount = await Project.countDocuments({
      status: "ON_HOLD",
    });
    const completedProjectsCount = await Project.countDocuments({
      status: "COMPLETED",
    });

    const projectStats = {
      planned: plannedProjectsCount,
      inProgress: inProgressProjectsCount,
      onHold: onHoldProjectsCount,
      completed: completedProjectsCount,
      total:
        plannedProjectsCount +
        inProgressProjectsCount +
        onHoldProjectsCount +
        completedProjectsCount,
    };

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
      projectStats,
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

export const getOrgTreeController = async (req, res) => {
  try {
    const departments = await Department.find();
    const designations = await Designation.find();
    const users = await User.find({ status: "ACTIVE" }).select(
      "name role employeeId department designation"
    );

    const tree = departments.map((dept) => {
      const deptDesignations = designations.filter(
        (d) => d.department.toString() === dept._id.toString()
      );

      const desigNodes = deptDesignations.map((desig) => {
        const desigUsers = users.filter(
          (u) =>
            u.designation && u.designation.toString() === desig._id.toString()
        );

        const management = desigUsers
          .filter((u) => u.role === "Management")
          .map((u) => ({
            name: u.name,
            role: u.role,
            empId: u.employeeId,
            children: [],
          }));
        const managers = desigUsers
          .filter((u) => u.role === "Manager")
          .map((u) => ({
            name: u.name,
            role: u.role,
            empId: u.employeeId,
            children: [],
          }));
        const teamLeaders = desigUsers
          .filter((u) => u.role === "Team Leader")
          .map((u) => ({
            name: u.name,
            role: u.role,
            empId: u.employeeId,
            children: [],
          }));
        const employees = desigUsers
          .filter((u) => u.role === "Employee")
          .map((u) => ({
            name: u.name,
            role: u.role,
            empId: u.employeeId,
            children: [],
          }));

        if (employees.length > 0) {
          if (teamLeaders.length > 0)
            teamLeaders.forEach((tl) => (tl.children = [...employees]));
          else if (managers.length > 0)
            managers.forEach((m) => (m.children = [...employees]));
          else if (management.length > 0)
            management.forEach((m) => (m.children = [...employees]));
        }

        if (teamLeaders.length > 0) {
          if (managers.length > 0)
            managers.forEach((m) => (m.children = [...teamLeaders]));
          else if (management.length > 0)
            management.forEach((m) => (m.children = [...teamLeaders]));
        }

        if (managers.length > 0) {
          if (management.length > 0)
            management.forEach((m) => (m.children = [...managers]));
        }

        let topLevelUsers = [];
        if (management.length > 0) topLevelUsers = management;
        else if (managers.length > 0) topLevelUsers = managers;
        else if (teamLeaders.length > 0) topLevelUsers = teamLeaders;
        else topLevelUsers = employees;

        return {
          name: desig.designationName,
          role: "Designation",
          children: topLevelUsers,
        };
      });

      return {
        name: dept.departmentName,
        role: "Department",
        children: desigNodes,
      };
    });

    return successResponse(res, "Org tree fetched successfully", [
      { name: "Organization", role: "Root", children: tree },
    ]);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
