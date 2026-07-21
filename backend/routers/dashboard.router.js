import express from "express";
import {
  allDetailsController,
  getOrgTreeController,
} from "../controllers/dashboard.controller.js";
import { verifyCookie } from "../utils/verify.cookie.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/details", verifyCookie, allDetailsController);
dashboardRouter.get("/org-tree", verifyCookie, getOrgTreeController);

export default dashboardRouter;
