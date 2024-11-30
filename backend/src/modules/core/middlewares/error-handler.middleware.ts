import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors';

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, _) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      message: err.message,
      details: err.errors,
    });
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && err['status'] === 400 && 'body' in err) {
    res.status(422).json({
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
  });
};
