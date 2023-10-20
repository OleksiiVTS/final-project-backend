import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  return token;
};

export default generateToken;
