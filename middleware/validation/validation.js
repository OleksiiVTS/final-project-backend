import { userSingSchema, userVerifySchema } from "../../models/user.js";
import { reviewAddSchema } from "../../models/review.js";
import { validateBody } from "../../decorators/index.js";

export const ausValidate = validateBody(userSingSchema);
export const ausVerify = validateBody(userVerifySchema);
export const reviewValidate = validateBody(reviewAddSchema);
