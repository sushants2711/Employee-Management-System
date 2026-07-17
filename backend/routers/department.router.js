import express from "express";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagement } from "../utils/verify.management.js";
import {
  createDepartmentController,
  deleteTheDepartmentByIdController,
  getAllActiveDepartmentController,
  getAllDepartmentController,
  getSingleDepartmentController,
  updateTheDepartmentController,
} from "../controllers/department.controller.js";
import {
  createDepartmentMiddleware,
  updateDepartmentMiddleware,
} from "../middlewares/department.middleware.js";

const departmentRouter = express.Router();

departmentRouter
  .route("/create-department")
  .post(
    verifyCookie,
    verifyManagement,
    createDepartmentMiddleware,
    createDepartmentController
  );

departmentRouter.route("/all").get(verifyCookie, getAllDepartmentController);

departmentRouter
  .route("/single/:id")
  .get(verifyCookie, getSingleDepartmentController);

departmentRouter
  .route("/update-department/:id")
  .put(
    verifyCookie,
    verifyManagement,
    updateDepartmentMiddleware,
    updateTheDepartmentController
  );

departmentRouter
  .route("/delete-department/:id")
  .delete(verifyCookie, verifyManagement, deleteTheDepartmentByIdController);

departmentRouter
  .route("/all-active")
  .get(verifyCookie, getAllActiveDepartmentController);

export default departmentRouter;
