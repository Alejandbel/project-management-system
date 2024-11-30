import { NextFunction, Request, Response } from 'express';

import { ForbiddenError } from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

export const roles =
  (allowedRoles: EMPLOYEE_ROLE[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedRoles.includes(req.user?.role as EMPLOYEE_ROLE)) {
      return next(new ForbiddenError('No access to endpoint'));
    }

    return next();
  };
