import { Request, Response, Router } from 'express';
import { IConfigServerFacade } from '../client/ConfigServerFacade';
import { isConfigItem } from '../validators/isConfigItem';

export function apiController(facade: IConfigServerFacade) {
  const apiRouter = Router();
  apiRouter.get('/config/:artifact/:type/:key', async (req: Request, res: Response) => {
    const { params } = req;

    if (isConfigItem(params)) {
      const value = await facade.getConfigItem(params);

      res.json({ value });
    } else {
      res.status(400).json({ error: 'Invalid config item' });
    }
  });

  apiRouter.post('/config/:artifact/:type/:key', async (req: Request, res: Response) => {
    const { params, body } = req;

    if (isConfigItem(params)) {
      await facade.setConfigItem(params, body.value);

      res.json({ value: body });
    } else {
      res.status(400).json({ error: 'Invalid config item' });
    }
  });

  return apiRouter;
}