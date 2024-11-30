import { z } from 'zod';

import { SortDirection } from '@modules/core';

import { createProjectBodySchema, updateProjectBodySchema } from '../schemas';
export type Project = {
  id: number;
  key: string;
  name: string;
  leadId?: number | null;
  departmentId: number;
  createdAt: string;
};

export type ProjectWithRelations = Project & {
  lead?: string | null;
  department: string;
};

export type ProjectToUpdate = z.infer<typeof updateProjectBodySchema>;
export type ProjectToCreate = z.infer<typeof createProjectBodySchema>;

export type ProjectListOptions = {
  sortField?: PROJECT_SORT_FIELD;
  sortDirection?: SortDirection;
  limit?: number;
  offset?: number;
  departmentId?: number;
};

export enum PROJECT_SORT_FIELD {
  ID = 'id',
  KEY = 'key',
  NAME = 'name',
}
