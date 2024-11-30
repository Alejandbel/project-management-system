import { z } from 'zod';

import { SORT_DIRECTION } from '../types';

export const idParamsSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int()),
});

export const dateSchema = z.preprocess((val: any) => new Date(val), z.date());
export const numberSchema = z.preprocess((val: any) => parseInt(val), z.number());

export const sortDirectionSchema = z.enum(Object.values(SORT_DIRECTION) as [string, ...string[]]);
