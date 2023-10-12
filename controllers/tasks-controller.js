import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { HttpError } from "../helpers/index.js";
import { Task } from "../models/Task.js";

const getAllTasks = async (req, res) => {
  //
};

const addTask = async (req, res) => {
  const { _id: owner } = req.user;

  console.log("this is add");
  const task = await Task.create({ ...req.body, owner });
  res.json({ task });
};

const updateTask = async (req, res) => {
  //
};

const deleteTask = async (req, res) => {
  //
};

export default {
  getAllTasks: ctrlWrapper(getAllTasks),
  addTask: ctrlWrapper(addTask),
  updateTask: ctrlWrapper(updateTask),
  deleteTask: ctrlWrapper(deleteTask),
};
