import express from "express";
import {
  validateTaskAdd,
  validateTaskUpdate,
} from "../../middleware/validation/validation.js";
import taskCtrl from "../../controllers/tasks-controller.js";
import authenticate from "../../middleware/validation/authenticate.js";
import validateMongoDBId from "../../middleware/validation/validateMongoDBId.js";

const tasksRouter = express.Router();

tasksRouter.post("/", authenticate, validateTaskAdd, taskCtrl.addTask);

tasksRouter.patch(
  "/:taskId",
  authenticate,
  validateMongoDBId,
  validateTaskUpdate,
  taskCtrl.updateTask
);

tasksRouter.delete(
  "/:taskId",
  authenticate,
  validateMongoDBId,
  taskCtrl.deleteTask
);

export default tasksRouter;
