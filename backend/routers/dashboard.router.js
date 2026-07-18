import express from "express";
import { allDetailsController } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/details", allDetailsController);

export default dashboardRouter;
