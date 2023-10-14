import { userSingSchema, userVerifySchema } from "../../models/user.js";
import { reviewAddSchema } from "../../models/review.js";
import { taskAddSchema } from "../../models/task.js";
import { validateBody } from "../../decorators/index.js";

export const ausValidate = validateBody(userSingSchema);
export const ausVerify = validateBody(userVerifySchema);
export const validateReview = validateBody(reviewAddSchema);
export const taskValidate = validateBody(taskAddSchema);
