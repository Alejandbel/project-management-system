import { RequestHandler } from 'express';
import { Schema } from 'zod';

const validationFactory = (target: 'body' | 'params' | 'query') => {
  return (schema: Schema): RequestHandler => {
    return async (req, res, next) => {
      try {
        req[target] = await schema.parseAsync(req[target]);
        next();
      } catch (err) {
        next(err);
      }
    };
  };
};

export const applyBodyValidation = validationFactory('body');
export const applyParamsValidation = validationFactory('params');
export const applyQueryValidation = validationFactory('query');
export const applyResponseValidation = (schema: Schema): RequestHandler => {
  return async (req, res, next) => {
    const originalJson = res.json;
    res.json = (responseValue): any => {
      if (res.statusCode >= 300) {
        return originalJson.call(res, responseValue);
      }

      try {
        const value = schema.parse(responseValue);
        return originalJson.call(res, value);
      } catch (err) {
        next(err);
      }
    };
  };
};
