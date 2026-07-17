import express from "express";
import { verifyCookie } from "../utils/verify.cookie";
import { verifyManagement } from "../utils/verify.management";
import {
  createDesignationMiddleware,
  updateDesignationMiddleware,
} from "../middlewares/designation.middleware";
import {
  createDesignationController,
  deleteDesignationController,
  getDesignationController,
  getSingleDesignationController,
  updateDesignationController,
} from "../controllers/designation.controller";

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

export default designationRouter;
