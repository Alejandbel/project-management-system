import { z } from 'zod';

export const createWorklogBodySchema = z
  .object({
    timeSpent: z.number().min(0),
    issueId: z.number(),
  })
  .strip();
