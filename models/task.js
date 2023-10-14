import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError, runValidateAtUpdate } from "./hooks.js";

// const timePattern = /^[0-2][0-3]:[0-5][0-9]$/;
const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
// const datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
const datePattern =
  /^(202[3-9]|20[3-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

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

// taskSchema.pre("findOneAndUpdate", runValidateAtUpdate);
taskSchema.post("findOneAndUpdate", hookError);

export const Task = model("task", taskSchema);

export const taskAddSchema = Joi.object({
  title: Joi.string().required().max(250).messages({
    "any.required": `"title" must be exist`,
    "string.empty": `"title" must be not empty`,
  }),
  start: Joi.string().required().pattern(timePattern).messages({
    "any.required": `"start" must be exist`,
    "string.pattern.base": `time is not valid`,
  }),
  end: Joi.string().required().pattern(timePattern).messages({
    "any.required": `"end" must be exist`,
    "string.pattern.base": `time is not valid`,
  }),
  priority: Joi.string()
    .required()
    .valid(...priorityList)
    .messages({ "any.required": `"priority" must be exist` }),
  date: Joi.string().required().pattern(datePattern).messages({
    "any.required": `"date" must be exist`,
    "string.pattern.base": `date is not valid`,
  }),
  category: Joi.string()
    .required()
    .valid(...categoryList)
    .messages({ "any.required": `"category" must be exist` }),
});

export const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .max(250)
    // .pattern(/^\S(.*\S)?$/)
    .messages({ "string.empty": `"title" must be not empty` }),
  start: Joi.string()
    .pattern(timePattern)
    .messages({ "string.pattern.base": `time is not valid` }),
  end: Joi.string()
    .pattern(timePattern)
    .messages({ "string.pattern.base": `time is not valid` }),
  priority: Joi.string().valid(...priorityList),
  date: Joi.string().pattern(datePattern).messages({
    "any.required": `"date" must be exist`,
    "string.pattern.base": `date is not valid`,
  }),
  category: Joi.string().valid(...categoryList),
});
