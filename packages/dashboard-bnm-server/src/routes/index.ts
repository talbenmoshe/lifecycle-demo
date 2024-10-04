import { Router } from 'express';

import { apiController } from '../controllers/apiController';
import { createConfigFacade } from '../client/createConfigFacade';
import { index } from '../controllers/index';

export const indexa = Router();

const facade = createConfigFacade();

indexa.use('/api', apiController(facade));
indexa.use('/', index);
