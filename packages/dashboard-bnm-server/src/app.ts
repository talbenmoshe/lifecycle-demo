
// Routes
import { type Application } from 'express';
import { indexa } from './routes/index';

export default (app: Application) => {
  app.use('/', indexa);
};