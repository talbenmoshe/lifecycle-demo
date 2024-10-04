import ejs from 'ejs';
import { Request, Response } from 'express';
import path from 'path';

const finalPath = path.join(__dirname, '../../views/index.ejs');

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
  const result = await ejs.renderFile(finalPath, { ...res.locals }, { async: true });

  res.send(result);
  res.end();
};
