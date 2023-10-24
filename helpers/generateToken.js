import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

// const generateToken = async (user) => {
//   const { _id: id } = user;
//   const payload = { id };
//   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

//   user.token = token;

//   await user.save();

//   return token;
// };

const generateToken = async (id) => {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "23h" });
  return token;
};

export default generateToken;
