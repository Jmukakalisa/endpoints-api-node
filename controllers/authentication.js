import {
  createNewUser,
  findOneUser,
  getAllUsers,
} from '../users/authUsers.js';
import jwt from 'jsonwebtoken';
import express from 'express';

const app = express();

const isNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const duplicate = await findOneUser(email);
    if (duplicate)
      return res
        .status(401)
        .json({ status: 401, success: false, message: 'Email already exist' });

    const newUser = await createNewUser(username, email, password);

    res.status(201).json({ status: 201, success: true, data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal error ${error.message}` });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ status: 200, success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal error while getting all users ${error.message}` });
  }
};

// app.get('/user', (req, res) => {
//   const token = req.cookies.token;

//   getUserFromToken(token)
//     .then(user => {
//       res.json({username:user.username});
//     })
//     .catch(err => {
//       console.log(err);
//       res.sendStatus(500);
//     });

// });

// app.post('/login', (req, res) => {
//   const {username, password} = req.body;
//   User.findOne({username}).then(user => {
//     if (user && user.username) {
//       const passOk = bcrypt.compareSync(password, user.password);
//       if (passOk) {
//         jwt.sign({id:user._id}, secret, (err, token) => {
//           res.cookie('token', token).send();
//         });
//       } else {
//         res.status(422).json('Invalid username or password');
//       }
//     } else {
//       res.status(401).json('User alredy exists');
//     }
//   });
// });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await findOneUser(email);
    if (!userExist) {
      res.status(422).json({
        status: 422,
        success: false,
        message: `User not found ${email}`,
      });
    } else {
      const isMatch = await userExist.confirmPassword(password);
      if (!isMatch) {
        res.status(401).json({
          status: 401,
          success: false,
          message: `Invalid password`,
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
      .json({ message: `Internal error while logging in user ${error.message}` });
  }
};

app.post('/logout', (req, res) => {
  res.cookie('token', '').send();
});


export { isNewUser, getUsers, login };
