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
  }).populate("owner", "username avatarURL");
  res.json(result);
};

const addReview = async (req, res) => {
  const { _id } = req.user;
  const existingReview = await Review.findOne({ owner: _id });
  if (existingReview) {
    throw HttpError(409, "The user has already left a review");
  }

  const result = await Review.create({
    ...req.body,
    owner: _id,
  });
  const newReview = {
    _id: result._id,
    comment: result.comment,
    rating: result.rating,
    owner: result.owner,
  };

  await User.findByIdAndUpdate(_id, { ownReview: newReview }, { new: true });

  res.status(201).json(newReview);
};

const updateReview = async (req, res) => {
  const { _id } = req.user;
  const result = await Review.findOneAndUpdate(
    { owner: _id },
    {
      ...req.body,
    },
    { new: true }
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
  ).populate("owner", "username avatarURL");

  if (!result) {
    throw HttpError(404, "Review not found");
  }
  res.status(201).json(result);
};

const deleteUserReview = async (req, res) => {
  const { _id } = req.user;
  const result = await Review.findOneAndDelete({ owner: _id });

  if (!result) {
    throw HttpError(404, "Review not found");
  }

  await User.findOneAndUpdate({ _id }, { ownReview: null }, { new: true });

  res.json({ message: "Deleted successfully" });
};

export default {
  addReview: ctrlWrapper(addReview),
  listAllReviews: ctrlWrapper(listAllReviews),
  getUserReview: ctrlWrapper(getUserReview),
  deleteUserReview: ctrlWrapper(deleteUserReview),
  updateReview: ctrlWrapper(updateReview),
};
