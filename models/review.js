import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
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
  comment: Joi.string()
    .required()
    .messages({ "any.required": `"comment" should be filled in` }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({ "any.required": `"rating" should be filled in` }),
});

export default Review;
