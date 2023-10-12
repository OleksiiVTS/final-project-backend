import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";

const timePattern = /^[0-2][0-3]:[0-5][0-9]$/;
const datePatterr = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

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
      match: datePatterr,
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

const Task = model("review", taskSchema);

export const taskAddSchema = Joi.object({
  //
});

export default Task;
