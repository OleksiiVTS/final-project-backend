import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    avatarURL: {
      type: String,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Rating is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

reviewSchema.post("save", hookError);

const Review = model("review", reviewSchema);

export const reviewAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": `"name" mast be exist` }),
  comment: Joi.string()
    .required()
    .messages({ "any.required": `"comment" mast be exist` }),
});

export default Review;
