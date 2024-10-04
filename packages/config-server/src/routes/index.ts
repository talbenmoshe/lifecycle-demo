import { Router } from 'express';

import { apiController } from '../controllers/apiController';
import { createConfigFacade } from '../client/createConfigFacade';

export const index = Router();

const facade = createConfigFacade();

index.use('/api', apiController(facade));
