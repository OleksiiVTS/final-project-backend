import User from "../models/user.js";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

import "dotenv/config.js";
import {
  HttpError,
  cloudinary,
  sendEmail,
  letter,
  generateAvatar,
  generateToken,
  normalizeUser,
} from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { Task } from "../models/usertask.js";
import Review from "../models/review.js";

const { BASE_URL, SECRET_CRITERIA, SECRET_REFERENCE } = process.env;

const userRegister = async (req, res) => {
  const { email, password, username } = req.body;
  const token = req.body.token;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Sorry! But this email is already in use.");

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatar = await generateAvatar(username);

  // ----------Google Scenario--------
  if (token) {
    try {
      const result = jwt.decode(token);
      if (result[SECRET_CRITERIA] !== SECRET_REFERENCE) {
        console.log("WARNING not equal criteria");
        throw HttpError(400, '"token" is not allowed'); // no one gonna know, ha ha
      }

      const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL: avatar,
        verify: true,
        verificationToken: null,
      });

      const TokenForDb = await generateToken(newUser._id);
      newUser.token = TokenForDb;
      newUser.save;

      res.status(201).json({ message: "registered successful", user: newUser });
      return; // !!!
      //
    } catch (e) {
      console.log(e);
      throw HttpError(400, '"token" is not allowed');
    }
  }

  // ----------Common Email Scenario--------

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL: avatar,
  });
  const verifyEmail = {
    to: newUser.email,
    subject: "GooseTrack verification email",
    html: letter(BASE_URL, verificationToken),
  };

  await sendEmail(verifyEmail);

  res.status(201).json({ message: "registered successful" });
};

const getVerification = async (req, res) => {
  const verificationToken = req.params.verificationToken;
  const user = await User.findOne({ verificationToken });

  // if (!user) throw HttpError(404, "Sorry! User not found.");
  if (!user) {
    res.redirect(
      302,
      `https://oleksiivts.github.io/final-project-frontend/`
      // `http://localhost:3000/final-project-frontend/`
    );
  }

  const { _id: id } = user;
  const token = await generateToken(id);

  await User.findByIdAndUpdate(id, {
    verify: true,
    verificationToken: null,
    token,
  });

  res.redirect(
    302,
    `https://oleksiivts.github.io/final-project-frontend/verified/${token}`
    // `http://localhost:3000/final-project-frontend/verified/${token}`
  );
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email or password is wrong");

  if (!user.verify) throw HttpError(401, "Email not confirmed");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

  const token = await generateToken(user._id);
  user.token = token;
  user.save;

  const normalizedUser = normalizeUser({ ...user._doc });

  res.status(200).json({ user: normalizedUser });
};

const repeatVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(400, "Email not found");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verifyEmail = {
    to: user.email,
    subject: "GooseTrack Repeat verify email",
    html: letter(BASE_URL, user.verificationToken),
  };
  await sendEmail(verifyEmail);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const updateUser = async (req, res) => {
  const { _id: id, email } = req.user;

  const user = await User.findOne({ email });
  if (!user)
    throw HttpError(
      409,
      "Sorry, this email is already in use by another registered user. Please provide a different email address."
    );

  const tempPath = req.file ? req.file.path : null;

  const { url: avatarURL, public_id } = tempPath
    ? await cloudinary.uploader.upload(tempPath, {
        folder: "avatarUser",
        width: 256,
        height: 256,
      })
    : {};

  if (tempPath) {
    await fs.unlink(tempPath);
    if (user.public_id) {
      await cloudinary.uploader
        .destroy(user.public_id)
        .then((result) => result);
    }
  }

  const bodyForUpdate = tempPath
    ? { ...req.body, avatarURL, public_id }
    : { ...req.body };

  const updatedUser = await User.findByIdAndUpdate(id, bodyForUpdate, {
    new: true,
  });

  if (!updatedUser) throw HttpError(400);

  res.json({
    updatedUser,
  });
};

const getCurrent = async (req, res) => {
  const user = normalizeUser({ ...req.user._doc });

  res.status(200).json({ ...user });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  const { _id } = req.user;

  if (email !== req.user.email) throw HttpError(400, "Invalid email");

  await Review.findOneAndDelete({ owner: _id });

  await Task.deleteMany({ owner: _id });

  await User.findOneAndDelete({ _id });

  res.status(204).send();
};

export default {
  userRegister: ctrlWrapper(userRegister),
  userLogin: ctrlWrapper(userLogin),
  getCurrent: ctrlWrapper(getCurrent),
  userLogout: ctrlWrapper(userLogout),
  updateUser: ctrlWrapper(updateUser),
  getVerification: ctrlWrapper(getVerification),
  repeatVerify: ctrlWrapper(repeatVerify),
  deleteUser: ctrlWrapper(deleteUser),
};
