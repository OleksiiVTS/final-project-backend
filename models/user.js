import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";
import { getCurrentDate } from "../helpers/index.js";

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phonePattern = /^\+380\d{9}$/;
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const withoutSpacesPattern = /^\S(.*\S)?$/;

const userBirthday = getCurrentDate();

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minLength: 4,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailPattern,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: 8,
    },
    phone: {
      type: String,
      pattern: phonePattern,
      unique: true,
      default: null,
    },
    skype: {
      type: String,
      default: null,
      maxLength: 16,
    },
    birthday: {
      type: String,
      pattern: datePattern,
      default: userBirthday,
    },
    avatarURL: {
      type: String,
    },
    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "light",
    },
    public_id: {
      type: String,
      default: null,
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", hookError);
// userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
// userSchema.post("findOneAndUpdate", hookError);

const User = model("user", userSchema);

export const authRegisterSchema = Joi.object({
  username: Joi.string()
    .min(4)
    .required()
    .messages({ "any.required": `"username" mast be exist` }),
  email: Joi.string()
    .pattern(emailPattern)
    .required()
    .messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "any.required": `"password" mast be exist` }),
});

export const authLoginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailPattern)
    .required()
    .messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "any.required": `"password" mast be exist` }),
});

export const authUpdateSchema = Joi.object({
  username: Joi.string().min(4).pattern(withoutSpacesPattern),
  birthday: Joi.string().pattern(datePattern),
  email: Joi.string().pattern(emailPattern),
  phone: Joi.string().pattern(phonePattern),
  skype: Joi.string().pattern(phonePattern),
  theme: Joi.string().valid("dark", "light"),
  avatarURL: Joi.string(),
  path: Joi.binary(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string()
    .pattern(emailPattern)
    .required()
    .messages({ message: "missing required field email" }),
});

export default User;
