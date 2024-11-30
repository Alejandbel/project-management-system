import { z } from 'zod';

import { numberSchema, sortDirectionSchema } from '@modules/core';

import { DEPARTMENT_SORT_FIELD } from '../types';

export const getDepartmentListQuerySchema = z
  .object({
    sortDirection: sortDirectionSchema.nullish(),
    sortField: z.enum(Object.values(DEPARTMENT_SORT_FIELD) as [string, ...string[]]).nullish(),
    limit: numberSchema.optional(),
    offset: numberSchema.optional(),
  })
  .strip();

export const updateDepartmentBodySchema = z
  .object({
    title: z.string().max(255).optional(),
  })
  .strip()
  .required();

export const createDepartmentBodySchema = z
  .object({
    title: z.string().max(255),
  })
  .strip()
  .required();
