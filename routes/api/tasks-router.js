import express from "express";
import { validateTaskAdd } from "../../middleware/validation/validation.js";
import taskController from "../../controllers/tasks-controller.js";
import authenticate from "../../middleware/validation/authenticate.js";

const tasksRouter = express.Router();

// taskRouter.post("/",authenticate, validateTaskAdd, taskController.addTask);
tasksRouter.post("/", validateTaskAdd, taskController.addTask);

export default tasksRouter;
