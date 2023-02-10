import { Router } from 'express';
import { getAllQueries, sendQuery } from '../controllers/queryControllers.js';
import {
  isAdmin,
  isLoggedIn,
} from '../middleware/authentication/middlewareAuth.js';
import { queriesSchema } from '../middleware/validation/validation.js';
import validate from '../middleware/validation/middlewareValidations.js';
const queryRouter = Router();

queryRouter.get('/queries', [isLoggedIn, isAdmin], getAllQueries);
queryRouter.post('/queries', validate(queriesSchema), sendQuery);

export default queryRouter;
