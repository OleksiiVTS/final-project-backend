import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import "dotenv/config.js";
import { HttpError, cloudinary, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const isUser = await User.findOne({ email });
  if (isUser) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const user = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  // const verifyEmail = {
  //   to: email,
  //   subject: "Nodemailer test",
  //   html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}" >Click to verification</a>`,
  // };

  // await sendEmail(verifyEmail);

  const response = await fetch(`https://ui-avatars.com/api/?name=${name}`);
  if (response.ok) {
    const firstLetterName = name[0];
    const avatarURL = `https://ui-avatars.com/api/?name=${firstLetterName}&size=256`;
    await User.findByIdAndUpdate(user._id, { avatarURL }, { new: true });
  } else {
    throw HttpError(response.status);
  }

  res.status(201).json({
    name: user.name,
    email: user.email,
  });
};

const getVerification = async (req, res) => {
  const verificationToken = req.params.verificationToken;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, `"User not found"`);
  }
  const { _id: id } = user;
  await User.findByIdAndUpdate(id, { verify: true, verificationToken: " " });

  res.status(200).json({
    message: "Verification successful",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, `"Email or password is wrong"`);
  }
  if (!user.verify) {
    throw HttpError(401, `"User is not verify"`);
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, `"Email or password is wrong"`);
  }
  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.status(200).json({
    token,
  });
};

const repeatVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user.verify) {
    throw HttpError(400, `"Verification has already been passed"`);
  }

  const verifyEmail = {
    to: user.email,
    subject: "Nodemailer test",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}" >Click to verification</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const updateUser = async (req, res) => {
  const { _id: id, public_id: oldPublic_id } = req.user;

  const tempPath = req.file ? req.file.path : null;
  if (tempPath) {
    await Jimp.read(tempPath)
      .then((image) => {
        image.resize(256, 256);
      })
      .catch((err) => {
        err.message;
      });

    const { url: avatarURL, public_id } = await cloudinary.uploader.upload(tempPath, {
      folder: "avatarUser",
    });
    await fs.unlink(tempPath);
    await cloudinary.uploader.destroy(oldPublic_id).then((result) => result);

    const updatedUserAndAvatar = await User.findByIdAndUpdate(id, { ...req.body, avatarURL, public_id }, { new: true });
    if (!updatedUserAndAvatar) throw HttpError(400);

    res.json(updatedUserAndAvatar);
  } else {
    const user = await User.findById(id);
    if (!user) throw HttpError(404, "User not found");

    const updatedUser = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!updatedUser) throw HttpError(400);

    res.json(updatedUser);
  }
};

const getCurrent = async (req, res) => {
  const { name, email, phone, skype, birthday, theme } = req.user;
  res.status(200).json({ name, email, phone, skype, birthday, theme });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({
    message: `"Logout success"`,
  });
};

export default {
  userRegister: ctrlWrapper(userRegister),
  userLogin: ctrlWrapper(userLogin),
  getCurrent: ctrlWrapper(getCurrent),
  userLogout: ctrlWrapper(userLogout),
  updateUser: ctrlWrapper(updateUser),
  userChangeAvatar: ctrlWrapper(userChangeAvatar),
  getVerification: ctrlWrapper(getVerification),
  repeatVerify: ctrlWrapper(repeatVerify),
};
