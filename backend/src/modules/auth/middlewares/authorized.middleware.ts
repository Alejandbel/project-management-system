import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '@modules/core';

import { ACCESS_TOKEN_COOKIE } from '../contants';
import { JwtService } from '../services/jwt.service';

export class AuthorizedMiddleware extends BaseMiddleware {
  @inject(JwtService) private readonly jwtService: JwtService;

  handler(req: Request, res: Response, next: NextFunction): void {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    if (!accessToken) {
      return next(new UnauthorizedError('You must be authorized to access this endpoint'));
    }

    try {
      req.user = this.jwtService.validateAccessToken(accessToken);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new UnauthorizedError(err.message));
      }

      return next(new UnauthorizedError('Malformed access token'));
    }

    next();
  }
}
