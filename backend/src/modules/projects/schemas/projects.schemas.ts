import { z } from 'zod';

import { numberSchema, sortDirectionSchema } from '@modules/core';

import { PROJECT_SORT_FIELD } from '../types';

export const getProjectsListQuerySchema = z
  .object({
    sortDirection: sortDirectionSchema.nullish(),
    sortField: z.enum(Object.values(PROJECT_SORT_FIELD) as [string, ...string[]]).nullish(),
    limit: numberSchema.optional(),
    offset: numberSchema.optional(),
  })
  .strip();

export const createProjectBodySchema = z
  .object({
    key: z.string(),
    name: z.string(),
    leadId: z.number().optional(),
    departmentId: z.number(),
  })
  .strip();

export const updateProjectBodySchema = createProjectBodySchema.partial();
