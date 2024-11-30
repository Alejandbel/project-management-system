import { z } from 'zod';

import { getSalariesQuerySchema, updateSalaryBodySchema } from '../schemas';

export type UserSalary = {
  id: number;
  userId: number;
  salary: number;
  period: Date;
  createdAt: Date;
};

export type UserSalaryWithUser = UserSalary & {
  userName: string;
};

export type SalaryOptions = z.infer<typeof getSalariesQuerySchema>;
export type SalaryToUpdate = z.infer<typeof updateSalaryBodySchema>;
