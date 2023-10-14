import { Schema, model } from "mongoose";
import Joi from "joi";
import { hookError, runValidateAtUpdate } from "./hooks.js";

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
    avatarURL: {
      type: String,
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

export const authRegisterSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": `"name" mast be exist` }),
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string().min(8).required().messages({ "any.required": `"password" mast be exist` }),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string().min(8).required().messages({ "any.required": `"password" mast be exist` }),
});

export const userSingSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" mast be exist` }),
  password: Joi.string().min(8).required().messages({ "any.required": `"password" mast be exist` }),
  subscription: Joi.string(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ message: "missing required field email" }),
});

export default User;
