import jwt from "jsonwebtoken";
import userModel from "./models/userModels";

const secret = 'secret123';

export function getUserFromToken(token) {
  const userInfo = jwt.verify(token, secret);
  return userModel.findById(userInfo.id);
}