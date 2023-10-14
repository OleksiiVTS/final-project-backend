import Review from "../models/review.js";
import User from "../models/user.js";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const listAllReviews = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Review.find({}, "comment rating owner", {
    skip,
    limit,
  }).populate("owner", "name, avatarURL");
  res.json(result);
};

const addReview = async (req, res) => {
  const existingUser = await Review.findOne({ owner: req.user });
  if (existingUser) {
    throw HttpError(409, "The user has already left a review");
  }

  const result = await Review.create({
    ...req.body,
    owner: req.user,
  });
  res.status(201).json(result);
};

const updateReview = async (req, res) => {
  const result = await Review.findOneAndUpdate(
    { owner: req.user },
    {
      ...req.body,
      owner: req.user,
    }
  );
  if (!result) {
    throw HttpError(404, "Review not found");
  }
  res.json(result);
};

const getUserReview = async (req, res) => {
  const result = await Review.findOne(
    { owner: req.user },
    "comment rating owner"
  ).populate("owner", "name, avatarURL");

  if (!result) {
    throw HttpError(404, "Review not found");
  }
  res.status(201).json(result);
};

const deleteUserReview = async (req, res) => {
  const result = await Review.findOneAndDelete({ owner: req.user });

  if (!result) {
    throw HttpError(404, "Review not found");
  }

  res.json({ message: "Deleted successfully" });
};

export default {
  addReview: ctrlWrapper(addReview),
  listAllReviews: ctrlWrapper(listAllReviews),
  getUserReview: ctrlWrapper(getUserReview),
  deleteUserReview: ctrlWrapper(deleteUserReview),
  updateReview: ctrlWrapper(updateReview),
};
