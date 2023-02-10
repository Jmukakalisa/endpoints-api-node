import userModel from '../models/users.model.js';

const findOneUserService = async (email) => {
  const findOneUserRequest = await userModel.findOne({ email: email });
  return findOneUserRequest;
};

const createNewUserService = async (username, email, password) => {
  const createNewUserRequest = await new userModel({
    username: username,
    email: email,
    password: password,
  });
  await createNewUserRequest.save();
  const response = {
    username: createNewUserRequest.username,
    email: createNewUserRequest.email,
  };

  return response;
};

const getAllUsersService = async () => {
  const allUsersRequest = await userModel.find();
  return allUsersRequest;
};

export { findOneUserService, createNewUserService, getAllUsersService };
