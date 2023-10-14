import express from "express";
import { validateTaskAdd } from "../../middleware/validation/validation.js";
import taskController from "../../controllers/tasks-controller.js";
import authenticate from "../../middleware/validation/authenticate.js";

const tasksRouter = express.Router();

tasksRouter.post("/", authenticate, validateTaskAdd, taskController.addTask);

export default tasksRouter;
