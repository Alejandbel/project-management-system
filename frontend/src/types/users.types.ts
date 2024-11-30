import { Role } from './employee-roles.types';

export type User = {
  id: number;
  email: string;
  password: string;
  startWorksAt?: Date | null;
  endWorksAt?: Date | null;
  roleId: number;
  name: string;
};

export type UserWithRole = Omit<User, 'password'> & {
  role: Role
};
