import {
  authDeleteSchema,
  authLoginSchema,
  authRegisterSchema,
  authUpdateSchema,
  userVerifySchema,
} from "../../models/user.js";
import { reviewAddSchema } from "../../models/review.js";
import { taskAddSchema, taskUpdateSchema } from "../../models/usertask.js";
import { validateBody } from "../../decorators/index.js";

export const authRegisterValidate = validateBody(authRegisterSchema);
export const authLoginValidate = validateBody(authLoginSchema);
export const authUpdateValidate = validateBody(authUpdateSchema);
export const authDeleteValidate = validateBody(authDeleteSchema);

export const authVerify = validateBody(userVerifySchema);

export const validateReview = validateBody(reviewAddSchema);
export const validateTaskAdd = validateBody(taskAddSchema);
export const validateTaskUpdate = validateBody(taskUpdateSchema);
