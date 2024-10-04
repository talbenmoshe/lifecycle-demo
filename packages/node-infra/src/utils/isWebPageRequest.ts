import { Request } from 'express';

export function isWebPageRequest(req: Request): boolean {
  const acceptHeader = req.headers['accept'] || '';
  const isGetRequest = req.method === 'GET';
  const expectsHtml = acceptHeader.includes('text/html');

  return isGetRequest && expectsHtml;
}