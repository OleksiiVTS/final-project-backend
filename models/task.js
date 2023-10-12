import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";

const timePattern = /^[0-2][0-3]:[0-5][0-9]$/; // /^[00-23]:[00-59]$/
const datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/; // може це номер?

const categoryList = ["to-do", "in-progress", "done"];
const priorityList = ["low", "medium", "high"];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: 250,
      required: [true, "Title is required"],
    },
    start: {
      type: String,
      match: timePattern,
      required: [true, "Start time is required"],
    },
    end: {
      type: String,
      match: timePattern,
      required: [true, "End time is required"],
    },
    priority: {
      type: String,
      enum: priorityList,
      required: [true, "Priority is required"],
    },
    date: {
      type: String,
      match: datePattern,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      enum: categoryList,
      required: [true, "Category is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post("save", hookError);

export const Task = model("task", taskSchema);

export const taskAddSchema = Joi.object({
  title: Joi.string()
    .required()
    .max(250)
    .messages({ "any.required": `"title" mast be exist` }),
  start: Joi.string()
    .required()
    .pattern(timePattern)
    .messages({ "any.required": `"start" mast be exist` }),
  end: Joi.string()
    .required()
    .pattern(timePattern)
    .messages({ "any.required": `"end" mast be exist` }),
  priority: Joi.string()
    .required()
    .valid(...priorityList)
    .messages({ "any.required": `"priority" mast be exist` }),
  date: Joi.string()
    .required()
    .pattern(datePattern)
    .messages({ "any.required": `"date" mast be exist` }),
  category: Joi.string()
    .required()
    .valid(...categoryList)
    .messages({ "any.required": `"category" mast be exist` }),
});
