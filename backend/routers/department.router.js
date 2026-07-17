import express from "express";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagerOrManagement } from "../utils/verify.managerOrManagement.js";
import {
  createDepartmentController,
  deleteTheDepartmentByIdController,
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
    verifyManagerOrManagement,
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
    verifyManagerOrManagement,
    updateDepartmentMiddleware,
    updateTheDepartmentController
  );

departmentRouter
  .route("/delete-department/:id")
  .delete(
    verifyCookie,
    verifyManagerOrManagement,
    deleteTheDepartmentByIdController
  );

export default departmentRouter;
