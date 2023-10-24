import User from "../models/user.js";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import "dotenv/config.js";
import {
  HttpError,
  cloudinary,
  sendEmail,
  // letter,
  generateAvatar,
  generateToken,
} from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { Task } from "../models/usertask.js";
import Review from "../models/review.js";

const { BASE_URL } = process.env;

const userRegister = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Sorry! But this email already use.");

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  await generateAvatar(newUser);

  await generateToken(newUser);

  // const verifyEmail = {
  //   to: email,
  //   subject: "GooseTrack Verify email",
  //   html: letter(BASE_URL, verificationToken),
  // };

  // await sendEmail(verifyEmail);

  res.status(201).json(newUser);
};

const getVerification = async (req, res) => {
  const verificationToken = req.params.verificationToken;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Sorry! User not found.");
  }
  const { _id: id } = user;
  await User.findByIdAndUpdate(id, { verify: true, verificationToken: null });

  res.status(200).json({
    message: "Verification successful",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  // if (!user.verify) {
  //   throw HttpError(401, `"User is not verify"`);
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  await generateToken(user);

  res.status(200).json(user);
};

const repeatVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: user.email,
    subject: "GooseTrack Repeat verify email",
    html: letter(BASE_URL, verificationToken),
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
  const { _id, username, email, phone, skype, birthday, theme, avatarURL } =
    req.user;
  res
    .status(200)
    .json({ _id, username, email, phone, skype, birthday, theme, avatarURL });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({
    message: `"Logout success"`,
  });
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  const { _id } = req.user;
  
  console.log('email: ', email);
  if (email !== req.user.email) throw HttpError(400, "Invalid email");
  console.log('deleted');

  await Review.findOneAndDelete({ owner: _id });

  await Task.deleteMany({ owner: _id });

  await User.findOneAndDelete({ _id });

  res.status(204);
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
