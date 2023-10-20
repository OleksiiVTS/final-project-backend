import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError } from "./hooks.js";
import { getCurrentDate } from "../helpers/index.js";

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phonePattern = /^\+380\d{9}$/;
const datePattern =
  /^(202[3-9]|20[3-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

const userBirthday = getCurrentDate();

const themeList = ["dark", "light"];

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
    public_id: {
      type: String,
    },
    theme: {
      type: String,
      enum: themeList,
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
    },
    ownReview: {
      type: Schema.Types.ObjectId,
      ref: "review",
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", hookError);

const User = model("user", userSchema);

export const authRegisterSchema = Joi.object({
  username: Joi.string().min(4).required().empty(false).messages({
    "string.base": "The username must be a string.",
    "any.required": "The username field is required.",
    "string.empty": "The username must not be empty.",
  }),
  email: Joi.string().pattern(emailPattern).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(8).required().empty(false).messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty.",
  }),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(8).required().empty(false).messages({
    "string.base": "The password must be a string.",
    "any.required": "The password field is required.",
    "string.empty": "The password must not be empty.",
  }),
});

export const authUpdateSchema = Joi.object({
  username: Joi.string().min(4).empty(false).messages({
    "string.base": "The username must be a string.",
    "string.empty": "The username must not be empty.",
  }),
  birthday: Joi.string().pattern(datePattern).empty(false).messages({
    "string.base": "The birthday must be a string.",
    "string.empty": "The birthday must not be empty.",
    "string.pattern.base":
      "The email must be in format 2004-02-11(Year-Month-Day)",
  }),
  email: Joi.string().pattern(emailPattern).empty(false).messages({
    "string.base": "The email must be a string.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  phone: Joi.string().pattern(phonePattern).empty(false).messages({
    "string.base": "The phone must be a string.",
    "string.empty": "The phone must not be empty.",
    "string.pattern.base": "The email must be in format +380111111111",
  }),
  skype: Joi.string().pattern(phonePattern).empty(false).messages({
    "string.base": "The skype must be a string.",
    "string.empty": "The skype must not be empty.",
    "string.pattern.base": "The email must be in format +380111111111",
  }),
  theme: Joi.string()
    .valid(...themeList)
    .empty(false)
    .messages({
      "string.base": "The theme must be a string.",
      "string.empty": "The theme must not be empty.",
      "string.valid": "The theme must be either 'dark' or 'light'.",
    }),
  avatarURL: Joi.string().empty(false).messages({
    "string.base": "The avatarURL must be a string.",
    "string.empty": "The avatarURL must not be empty.",
  }),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().empty(false).messages({
    "string.base": "The email must be a string.",
    "any.required": "The email field is required.",
    "string.empty": "The email must not be empty.",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
});

export default User;
