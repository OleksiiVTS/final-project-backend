import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";

const timePattern = /^[0-2][0-3]:[0-5][0-9]$/;
const datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: 250,
      required: [true, "Title name for contact"],
    },
    start: {
      type: String,
      match: timePattern,
      required: [true, "Start is required"],
    },
    end: {
      type: String,
      match: timePattern,
      required: [true, "End is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Priority is required"],
    },
    date: {
      type: String,
      match: datePattern,
      required: [true, "Date name for contact"],
    },
    category: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      required: [true, "Category name for contact"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post("save", hookError);

const Task = model("task", taskSchema);

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
    .messages({ "any.required": `"priority" mast be exist` }),
  date: Joi.string()
    .required()
    .pattern(datePattern)
    .messages({ "any.required": `"date" mast be exist` }),
  category: Joi.string()
    .required()
    .messages({ "any.required": `"category" mast be exist` }),
});

export default Task;
