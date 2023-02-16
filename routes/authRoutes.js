import { Router } from 'express';
import {
  handleNewUser,
  getUsers,
  login,
} from '../controllers/authControllers.js';
import {
  isAdmin,
  isLoggedIn,
} from '../middleware/authentication/middlewareAuth.js';
import { userCreationSchema } from '../middleware/validation/validation.js';
import validate from '../middleware/validation/middlewareValidations.js';
import passport from 'passport';

const authenticationRouter = Router();
/**
 * @openapi
 * '/api/signup':
 *  post:
 *     tags:
 *     - Users
 *     summary: Signup a new user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: username
 *              email:
 *                type: string
 *                default: email
 *              password:
 *                type: string
 *                default: password
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
authenticationRouter.post(
  '/signup',
  validate(userCreationSchema),
  handleNewUser,
);

/**
 * @openapi
 * '/api/all-users':
 *  get:
 *     security:
 *       - jwt: []
 *       - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Get all users
 *     parameters:
 *     - name: id
 *     in: path
 *     description: The unique id for the user
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
authenticationRouter.get('/all-users', [isLoggedIn, isAdmin], getUsers);
authenticationRouter.post(
  '/login',

  /**
 * @openapi
 * '/api/login':
 *  post:
 *     tags:
 *     - Users
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: email
 *              password:
 *                type: string
 *                default: password
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 */
  passport.authenticate('local-login', { session: false }),
  login,
);

export default authenticationRouter;
