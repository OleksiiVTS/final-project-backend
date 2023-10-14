import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError, runValidateAtUpdate } from "./hooks.js";

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phonePattern = /^\+380\d{9}$/;
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
    },
    phone: {
      type: String,
      pattern: phonePattern,
      unique: true,
    },
    skype: {
      type: String,
    },
    birthday: {
      type: String,
      pattern: datePattern,
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

export const userSingSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string().min(8).required().messages({ "any.required": `"password" mast be exist` }),
  subscription: Joi.string(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ message: "missing required field email" }),
});

export default User;
