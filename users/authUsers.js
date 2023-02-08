import userModel from '../models/userModels.js';

// import jwt from "jsonwebtoken";
// import User from "./models/userModels.js";
// import userModel from '../models/userModels.js';
// const secret = 'secret123';

// export function getUserFromToken(token) {
//   const userInfo = jwt.verify(token, secret);
//   return userModel.findById(userInfo.id);
// }

const findOneUser = async (email) => {
  const findOneUserRequest = await userModel.findOne({ email: email });
  return findOneUserRequest;
};

const createNewUser = async (username, email, password) => {
  const newUserRequest = await new userModel({
    username: username,
    email: email,
    password: password,
  });
  await newUserRequest.save();
  const response = {
    username: newUserRequest.username,
    email: newUserRequest.email,
  };

  return response;
};

const getAllUsers = async () => {
  const allUsersRequest = await userModel.find();
  return allUsersRequest;
};

export { findOneUser, createNewUser, getAllUsers };


