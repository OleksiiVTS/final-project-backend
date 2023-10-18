import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";
import validateStartEndTime from "../helpers/validateStartEndTime.js";

const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const datePattern =
  /^(202[3-9]|20[3-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

const categoryList = ["to-do", "in-progress", "done"];
const priorityList = ["low", "medium", "high"];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: [250, "Too long title, max is 250 chars"],
      minLength: [3, "Too short title, min is 3 chars"],
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
      validate: {
        validator: function (value) {
          return value >= this.start;
        },
        message: "time must be equal or later than start time",
      },
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
  title: Joi.string().required().min(3).max(250).messages({
    "any.required": `title field is required`,
    "string.empty": `title must be not empty, between 3 snd 250 chars`,
  }),
  start: Joi.string().required().pattern(timePattern).messages({
    "string.base": "start field must be a string",
    "any.required": `start field is required`,
    "string.pattern.base": `time is not valid, must be 'mm-hh'`,
  }),
  end: Joi.string().required().pattern(timePattern).messages({
    "string.base": "end field must be a string",
    "any.required": `end field is required`,
    "string.pattern.base": `time is not valid, must be 'mm-hh'`,
  }),
  priority: Joi.string()
    .required()
    .valid(...priorityList)
    .messages({ "any.required": `priority field is required` }),
  date: Joi.string().required().pattern(datePattern).messages({
    "string.base": "date field must be a string",
    "any.required": `date field is required`,
    "string.pattern.base": `date is not valid, must be 'yyyy-mm-dd'`,
  }),
  category: Joi.string()
    .required()
    .valid(...categoryList)
    .messages({ "any.required": `category field is required` }),
})
  .custom(validateStartEndTime)
  .messages({
    "any.invalid": `end time must be equal or later than start time`,
  });

export const taskUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(250).messages({
    "string.empty": `title must be not empty, between 3 snd 250 chars`,
  }),
  start: Joi.string().pattern(timePattern).messages({
    "string.base": "start field must be a string",
    "string.pattern.base": `time is not valid, must be 'mm-hh'`,
  }),
  end: Joi.string().pattern(timePattern).messages({
    "string.base": "end field must be a string",
    "string.pattern.base": `time is not valid, must be 'mm-hh'`,
  }),
  priority: Joi.string().valid(...priorityList),
  date: Joi.string().pattern(datePattern).messages({
    "string.pattern.base": `date is not valid, must be 'yyyy-mm-dd'`,
  }),
  category: Joi.string().valid(...categoryList),
})
  .custom(validateStartEndTime)
  .messages({
    "any.invalid": `end time must be equal or later than start time`,
  });
