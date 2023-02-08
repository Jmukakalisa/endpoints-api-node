import jwt from 'jsonwebtoken';
import { findOneUser} from '../../users/authUsers.js';

const isLoggedIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

      const currentUser = await findOneUser(decodedData.email);
      if (!currentUser) {
        res.status(401).json({
          status: 401,
          success: false,
          message: `User does not exist!`,
        });
      } else {
        req.user = currentUser;
        next();
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: `Error authorizing user ${error.message}`,
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      success: false,
      message: `You need to login`,
    });
  }
};
const isAdmin = (req, res, next) => {
  try {
    if (req.user.isAdmin === true) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        success: false,
        message: `Access denied`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: `Error checking admin ${error.message}`,
    });
  }
};

export { isLoggedIn, isAdmin };
