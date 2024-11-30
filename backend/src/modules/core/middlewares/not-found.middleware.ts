import { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (_, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
};
