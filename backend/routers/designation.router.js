import express from "express";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagement } from "../utils/verify.management.js";
import {
  createDesignationMiddleware,
  updateDesignationMiddleware,
} from "../middlewares/designation.middleware.js";
import {
  createDesignationController,
  deleteDesignationController,
  getAllActiveDesignationController,
  getDesignationController,
  getSingleDesignationController,
  updateDesignationController,
} from "../controllers/designation.controller.js";

const designationRouter = express.Router();

designationRouter
  .route("/add-designation")
  .post(
    verifyCookie,
    verifyManagement,
    createDesignationMiddleware,
    createDesignationController
  );

designationRouter.route("/all").get(verifyCookie, getDesignationController);

designationRouter
  .route("/single/:id")
  .get(verifyCookie, getSingleDesignationController);

designationRouter
  .route("/update-designation/:id")
  .put(
    verifyCookie,
    verifyManagement,
    updateDesignationMiddleware,
    updateDesignationController
  );

designationRouter
  .route("/delete-designation/:id")
  .delete(verifyCookie, verifyManagement, deleteDesignationController);

designationRouter
  .route("/all-active")
  .get(verifyCookie, getAllActiveDesignationController);

export default designationRouter;
