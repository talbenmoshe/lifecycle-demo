import { NextFunction, Request, Response } from 'express';
import { isWebPageRequest } from '../utils/isWebPageRequest';
import { IStaticsProviderFactory } from './StaticsProviderFactory';

function parseKeyValuePairs(value: string): Record<string, string> | undefined {
  const regex = /^(.+:.+\|?)+$/; // Regex to match "key:value|key2:value2|..."

  if (!regex.test(value)) {
    return undefined;
  }

  return value.split('|').reduce((acc, pair) => {
    const [parsedKey, parsedValue] = pair.split(':');

    if (parsedKey && parsedValue) {
      acc[parsedKey] = parsedValue;
    }

    return acc;
  }, {} as Record<string, string>);
}

function getKeyValuePairs(req: Request, key: string): Record<string, string> | undefined {
  // Helper function to validate and parse key-value pair string

  // Search in URL params, headers, and cookies in that order
  const valueFromParams = req.query[key];
  const valueFromHeader = req.header(key);
  const valueFromCookie = req.cookies?.[key];
  const value = valueFromParams || valueFromHeader || valueFromCookie;

  if (value) {
    return parseKeyValuePairs(value);
  }

  return undefined;
}

export function createStaticsProviderMiddleware(staticsProviderFactory: IStaticsProviderFactory) {
  return function staticsProviderMiddleware(req: Request, res: Response, next: NextFunction) {
    if (isWebPageRequest(req)) {
      const overrides = getKeyValuePairs(req, 'staticsOverrides');
      res.locals.staticsProvider = staticsProviderFactory.getProvider(overrides);
    }
    next();
  };
}