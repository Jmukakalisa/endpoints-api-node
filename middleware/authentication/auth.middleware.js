import jwt from 'jsonwebtoken';
import { findOneUserService } from '../../services/auth.service.js';

const isLoggedIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

      const currentUser = await findOneUserService(decodedData.email);
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
        message: `Error when authorizing user ${error.message}`,
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      success: false,
      message: `Not logged in`,
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
      message: `Error while checking admin ${error.message}`,
    });
  }
};

export { isLoggedIn, isAdmin };
