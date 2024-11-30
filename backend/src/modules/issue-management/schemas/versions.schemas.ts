import { z } from 'zod';

import { numberSchema, sortDirectionSchema } from '@modules/core';

import { VERSION_SORT_FIELD } from '../types';

export const getVersionListQuerySchema = z
  .object({
    sortDirection: sortDirectionSchema.nullish(),
    sortField: z.enum(Object.values(VERSION_SORT_FIELD) as [string, ...string[]]).nullish(),
    limit: numberSchema.optional(),
    offset: numberSchema.optional(),
    projectId: numberSchema.optional(),
  })
  .strip();

export const createVersionBodySchema = z
  .object({
    title: z.string().max(255).optional(),
    isArchived: z.boolean().optional(),
    projectId: z.number(),
    startDate: z.coerce.date(),
    releaseDate: z.coerce.date().nullish(),
  })
  .strip();

export const updateVersionBodySchema = createVersionBodySchema.optional();
