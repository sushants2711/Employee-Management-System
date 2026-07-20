import express from "express";
import { allDetailsController } from "../controllers/dashboard.controller.js";
import { verifyCookie } from "../utils/verify.cookie.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/details", verifyCookie, allDetailsController);

export default dashboardRouter;
