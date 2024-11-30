import { EMPLOYEE_ROLE } from '@modules/users';

declare global {
  declare namespace Express {
    export interface Request {
      user?: {
        id: number;
        role: EMPLOYEE_ROLE;
      };
    }
  }
}
