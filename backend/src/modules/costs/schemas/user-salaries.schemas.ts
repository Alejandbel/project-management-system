import { z } from 'zod';

import { numberSchema } from '@modules/core';

export const getSalariesQuerySchema = z
  .object({
    month: numberSchema,
    year: numberSchema,
  })
  .strip();

export const updateSalaryBodySchema = z
  .object({
    salary: z.number(),
  })
  .strip();
