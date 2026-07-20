import express from "express";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagement } from "../utils/verify.management.js";
import {
  createProjectMiddleware,
  updateProjectMiddleware,
} from "../middlewares/project.middleware.js";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectController,
  getSingleProjectController,
  updateProjectController,
} from "../controllers/project.controller.js";

const projectRouter = express.Router();

// Create a new project (Only Management can create)
projectRouter
  .route("/create-project")
  .post(
    verifyCookie,
    verifyManagement,
    createProjectMiddleware,
    createProjectController
  );

// Get all projects (Any authenticated user can view)
projectRouter.route("/all-project").get(verifyCookie, getAllProjectController);

// Get a single project by ID
projectRouter
  .route("/single/:id")
  .get(verifyCookie, getSingleProjectController);

// Update a project (Only Management can update)
projectRouter
  .route("/update-project/:id")
  .put(
    verifyCookie,
    verifyManagement,
    updateProjectMiddleware,
    updateProjectController
  );

// Delete a project (Only Management can delete)
projectRouter
  .route("/delete-project/:id")
  .delete(verifyCookie, verifyManagement, deleteProjectController);

export default projectRouter;
