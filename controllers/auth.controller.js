import {
  createNewUserService,
  findOneUserService,
  getAllUsersService,
} from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
// import passport from 'passport';

const handleNewUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const duplicate = await findOneUserService(email);
    if (duplicate)
      return res
        .status(409)
        .json({ status: 409, success: false, message: 'Email already exist' });

    const newUser = await createNewUserService(username, email, password);

    res.status(201).json({ status: 201, success: true, data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error when creating new user ${error.message}` });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ status: 200, success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error when getting all users ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await findOneUserService(email);
    if (!userExist) {
      res.status(404).json({
        status: 404,
        success: false,
        message: `User not found with this email ${email}`,
      });
    } else {
      const isMatch = await userExist.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          status: 401,
          success: false,
          message: `Incorrect password`,
        });
      } else {
        const payload = {
          id: userExist._id,
          username: userExist.username,
          isAdmin: userExist.isAdmin,
          email: userExist.email,
        };
        const options = {
          expiresIn: '1d',
        };
        const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, options);
        res.status(200).json({ status: 200, success: true, token: token });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error when logging in user ${error.message}` });
  }
};

export { handleNewUser, getUsers, login };
