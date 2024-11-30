import { z } from 'zod';

export type Issue = {
  id: number;
  typeId: number;
  key: string;
  summary: string;
  versionId: number;
  hoursEstimated: number;
  assigneeId: number;
  dueDate: Date;
  description: string;
  statusId: number;
  createdAt: Date;
};

export const createIssueBodySchema = z
  .object({
    summary: z.string().max(1024),
    typeId: z.number(),
    key: z.string().max(16),
    versionId: z.number(),
    hoursEstimated: z.number(),
    assigneeId: z.number(),
    dueDate: z.coerce.date(),
    description: z.string(),
    statusId: z.number(),
  })
  .strip();

export const updateIssueBodySchema = createIssueBodySchema.optional();
