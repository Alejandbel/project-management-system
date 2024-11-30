import { z } from 'zod';

import { ItemListOptions } from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

import { updateUserBodySchema } from '../schemas';

export type User = {
  id: number;
  email: string;
  password: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  roleId: number;
  name: string;
};

export type UserWithRole = {
  id: number;
  email: string;
  startWorksAt: Date | null;
  endWorksAt: Date | null;
  roleId: number;
  role: EMPLOYEE_ROLE;
  name: string;
};

export type UserToUpdate = z.infer<typeof updateUserBodySchema>;

export type UsersListOptions = ItemListOptions<USERS_SORT_FIELD>;

export enum USERS_SORT_FIELD {
  ID = 'id',
  EMAIL = 'email',
  PASSWORD = 'password',
  START_WORKS_AT = 'startWorksAt',
  END_WORKS_AT = 'endWorksAt',
  NAME = 'name',
}
