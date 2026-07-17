import express from "express";
import {
  createTeamMiddleware,
  updateTeamMiddleware,
} from "../middlewares/team.middleware.js";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagement } from "../utils/verify.management.js";
import {
  allActiveTeamController,
  createTeamController,
  deleteTeamController,
  getAllTeamController,
  getSingleTeamController,
  updateTeamController,
} from "../controllers/team.controller.js";

const teamRouter = express.Router();

teamRouter
  .route("/create-team")
  .post(
    createTeamMiddleware,
    verifyCookie,
    verifyManagement,
    createTeamController
  );

teamRouter.route("/all-team").get(verifyCookie, getAllTeamController);

teamRouter.route("/single/:id").get(verifyCookie, getSingleTeamController);

teamRouter
  .route("/update-team/:id")
  .put(
    verifyCookie,
    verifyManagement,
    updateTeamMiddleware,
    updateTeamController
  );

teamRouter
  .route("/delete-team/:id")
  .delete(verifyCookie, verifyManagement, deleteTeamController);

teamRouter.route("/all-active-team").get(verifyCookie, allActiveTeamController);

export default teamRouter;
