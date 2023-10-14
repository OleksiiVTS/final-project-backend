import { authLoginSchema, authRegisterSchema, userVerifySchema } from "../../models/user.js";
import { reviewAddSchema } from "../../models/review.js";
import { taskAddSchema } from "../../models/Task.js";
import { validateBody } from "../../decorators/index.js";

export const authRegisterValidate = validateBody(authRegisterSchema);
export const authLoginValidate = validateBody(authLoginSchema);

// export const ausValidate = validateBody(userSingSchema);
export const ausVerify = validateBody(userVerifySchema);
export const reviewValidate = validateBody(reviewAddSchema);
export const validateTaskAdd = validateBody(taskAddSchema);
