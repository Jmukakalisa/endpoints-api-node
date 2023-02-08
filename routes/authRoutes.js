import { Router } from 'express';
// import passport from 'passport';
import {
  isNewUser,
  getUsers,
  login,
} from '../controllers/authentication.js';
import {
  isAdmin,
  isLoggedIn,
} from '../middleware/authentication/middlewareAuth.js';
import { userCreationSchema } from '../middleware/validation/validation.js';
import validate from '../middleware/validation/middlewareValidation.js';

const authenticationRouter = Router();

authenticationRouter.post(
  '/register',
  validate(userCreationSchema),
  isNewUser,
);
authenticationRouter.get('/all-users', [isLoggedIn, isAdmin], getUsers);
authenticationRouter.post('/login', login);
// authenticationRouter.post(
//   '/login',
//   passport.authenticate('local-login', { session: false }),
//   login
//   );

export default authenticationRouter;
