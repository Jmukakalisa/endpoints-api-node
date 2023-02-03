import { Router } from 'express';
import { getAllQueries, sendQuery } from '../controllers/query.controller.js';
import { queriesSchema } from '../middleware/validation/validation.js';
import validate from '../middleware/validation/validation.middleware.js';
const queryRouter = Router();

queryRouter.get('/queries', getAllQueries);
queryRouter.post('/queries', validate(queriesSchema), sendQuery);

export default queryRouter;
