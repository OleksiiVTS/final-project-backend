import { Task } from "../models/usertask.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { HttpError } from "../helpers/index.js";

const getAllTasks = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Task.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
  //
};

const addTask = async (req, res) => {
  const { _id: owner } = req.user;
  const { title } = req.body;

  const task = await Task.create({ ...req.body, title: title.trim(), owner });
  res.status(201).json({ task });
};

const updateTask = async (req, res) => {
  const { _id: owner } = req.user;
  const { taskId } = req.params;

  if (req.body.title) {
    req.body = { ...req.body, title: req.body.title.trim() };
  }

  const result = await Task.findOneAndUpdate({ _id: taskId, owner }, req.body, {
    new: true,
  });

  if (!result) throw HttpError(404, `id ${taskId} not found`);

  res.json(result);
};

const deleteTask = async (req, res) => {
  const { _id: owner } = req.user;
  const { taskId } = req.params;

  const result = await Task.findOneAndDelete({ _id: taskId, owner });
  if (!result) throw HttpError(404, `id=${taskId} not found`);

  res.json({ message: `task id=${taskId} deleted` });
};

export default {
  getAllTasks: ctrlWrapper(getAllTasks),
  addTask: ctrlWrapper(addTask),
  updateTask: ctrlWrapper(updateTask),
  deleteTask: ctrlWrapper(deleteTask),
};
