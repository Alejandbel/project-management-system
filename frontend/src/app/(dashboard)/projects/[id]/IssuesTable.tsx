'use client';

import React, { FormEvent } from 'react';
import { z } from 'zod';

import { IssueForm } from '@/app/(dashboard)/projects/[id]/IssueForm';
import { WorklogForm } from '@/app/(dashboard)/projects/[id]/WorklogForm';
import { Table, TableColumn } from '@/components/Table';
import { useAuth } from '@/hooks';
import { issuesService } from '@/services/api';
import { EMPLOYEE_ROLE, Issue, IssueWithTypeStatusTotalTime } from '@/types';
import { validateForm } from '@/utils';

export const issueBodySchema = z
  .object({
    id: z.preprocess(Number, z.number()).optional(),
    summary: z.string().max(1024),
    key: z.string().max(16),
    versionId: z.coerce.number(),
    hoursEstimated: z.coerce.number(),
    assigneeId: z.coerce.number(),
    dueDate: z.coerce.date(),
    description: z.string().max(1024),
    statusId: z.coerce.number(),
    typeId: z.coerce.number(),
  })
  .strip();

type IssuesTableProps = {
  issues: IssueWithTypeStatusTotalTime[],
  refetch: () => Promise<unknown>,
  versionId?: number
};

export function IssuesTable({ issues, versionId, refetch }: IssuesTableProps) {
  const { user } = useAuth('/');
  const issuesColumns: TableColumn<IssueWithTypeStatusTotalTime>[] = [
    { field: 'id', header: 'Id', type: 'numeric' },
    { field: 'summary', header: 'Summary', type: 'string' },
    { field: 'key', header: 'Key', type: 'string' },
    { field: 'type', header: 'Type', type: 'string' },
    { field: 'status', header: 'Status', type: 'string' },
    { field: 'description', header: 'Description', type: 'string' },
    { field: 'hoursEstimated', header: 'Estimated', template: (hours) => `${hours}h` },
    { field: 'totalTimeSpent', header: 'Total time spent', template: (minutes) => `${minutes}m` },
    { field: 'dueDate', header: 'Due date', type: 'date' },
  ];

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const issue = validateForm(event.currentTarget, issueBodySchema);

    if (issue.id) {
      await issuesService.updateIssue(issue.id, issue);
    } else {
      await issuesService.createIssue(issue);
    }

    await refetch();
  };

  const form = (issue?: Issue) => <IssueForm defaultIssue={{ versionId, ...issue }} />;
  const additionalTemplate = (issue: Issue) => <WorklogForm defaultWorklog={{ issueId: issue.id }} refetch={refetch} />;

  return (
    <Table
      size="small"
      items={issues}
      columns={issuesColumns}
      dialogForm={form}
      onSave={onSave}
      actions={([EMPLOYEE_ROLE.ADMIN, EMPLOYEE_ROLE.PROJECT_MANAGER] as Role[]).includes(user.role) ? ['update', 'create'] : []}
      paginate={false}
      additionalActionsTemplate={additionalTemplate}
    />
  );
}
