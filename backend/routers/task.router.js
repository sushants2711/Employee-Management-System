import express from "express";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagerOrManagement } from "../utils/verify.managerOrManagement.js";
import {
  createTaskMiddleware,
  updateTaskMiddleware,
  updateTaskStatusByUserMiddleware,
} from "../middlewares/task.middleware.js";
import {
  createTaskController,
  getTaskController,
  getSingleTaskController,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter
  .route("/create-task")
  .post(
    verifyCookie,
    verifyManagerOrManagement,
    createTaskMiddleware,
    createTaskController
  );

taskRouter.route("/get-tasks").get(verifyCookie, getTaskController);

taskRouter.route("/get-task/:id").get(verifyCookie, getSingleTaskController);

taskRouter
  .route("/update-task/:id")
  .put(
    verifyCookie,
    verifyManagerOrManagement,
    updateTaskMiddleware,
    updateTaskController
  );

taskRouter
  .route("/update-task-status/:id")
  .put(
    verifyCookie,
    updateTaskStatusByUserMiddleware,
    updateTaskStatusController
  );

taskRouter
  .route("/delete-task/:id")
  .delete(verifyCookie, verifyManagerOrManagement, deleteTaskController);

export default taskRouter;
