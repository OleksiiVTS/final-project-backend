import { isValidObjectId } from "mongoose";
import { HttpError } from "../../helpers/index.js";

const validateMongoDBId = (req, res, next) => {
  const { taskId } = req.params;
  if (isValidObjectId(taskId)) return next();
  return next(HttpError(404, `${taskId} is not valid id`));
};

export default validateMongoDBId;
