import jwt from "jsonwebtoken";
import { HttpError } from "../../helpers/index.js";
import { ctrlWrapper } from "../../decorators/index.js";
import User from "../../models/user.js";
import "dotenv/config.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    console.log("Bearer!!!");
    throw HttpError(401);
  }
  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email }).populate(
      "ownReview",
      "comment rating _id"
    );
    console.log("user: ", user);
    console.log(" user.token: ", user.token);
    if (!user || user.token === "") {
      throw HttpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch {
    throw HttpError(401);
  }
};

export default ctrlWrapper(authenticate);
