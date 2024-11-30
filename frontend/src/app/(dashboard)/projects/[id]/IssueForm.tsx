import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { issueStatusesService, issueTypesService, usersService } from '@/services/api';
import { Issue } from '@/types';

type IssueFormProps = {
  defaultIssue?: Partial<Issue>;
};

function useIssueForm() {
  const { data: issueStatuses, isSuccess: isStatusesSuccess, isLoading: isStatusesLoading } = useQuery({
    queryKey: ['/issue-statuses'],
    queryFn: () => issueStatusesService.getIssueStatuses(),
  });

  const { data: issueTypes, isSuccess: isTypesSuccess, isLoading: isTypesLoading } = useQuery({
    queryKey: ['/issue-types'],
    queryFn: () => issueTypesService.getIssueTypes(),
  });

  const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/users'],
    queryFn: () => usersService.getUsers(),
  });

  return {
    issueStatuses,
    users,
    issueTypes,
    isLoading: isStatusesLoading || isTypesLoading || isUsersLoading,
    isSuccess: isStatusesSuccess && isTypesSuccess && isUsersSuccess,
  };
}

export function IssueForm({ defaultIssue }: IssueFormProps) {
  const {
    issueStatuses, issueTypes, users, isLoading, isSuccess,
  } = useIssueForm();

  const [assigneeId, setAssigneeId] = useState(defaultIssue?.assigneeId);
  const [typeId, setTypeId] = useState(defaultIssue?.typeId);
  const [statusId, setStatusId] = useState(defaultIssue?.statusId);

  if (!isSuccess || isLoading) {
    return null;
  }

  return (
    <>
      <input hidden name="id" value={defaultIssue?.id} readOnly />
      <input hidden name="versionId" value={defaultIssue?.versionId} readOnly />

      <label htmlFor="summary" className="block text-900 font-medium mb-2">Summary</label>
      <InputText id="summary" defaultValue={defaultIssue?.summary} name="summary" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" defaultValue={defaultIssue?.key} name="key" className="w-full mb-3" required />

      <label htmlFor="description" className="block text-900 font-medium mb-2">Description</label>
      <InputText
        id="description"
        defaultValue={defaultIssue?.description}
        name="description"
        className="w-full mb-3"
        required
      />

      <label htmlFor="hoursEstimated" className="block text-900 font-medium mb-2">Hours estimated</label>
      <InputNumber
        id="hoursEstimated"
        value={defaultIssue?.hoursEstimated}
        name="hoursEstimated"
        className="w-full mb-3"
        required
      />

      <label htmlFor="assigneeId" className="block text-900 font-medium mb-2">Assignee</label>
      <Dropdown
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.value)}
        options={users!.items}
        name="assigneeId"
        id="assigneeId"
        optionValue="id"
        optionLabel="name"
        className="w-full mb-3"
      />

      <label htmlFor="statusId" className="block text-900 font-medium mb-2">Status</label>
      <Dropdown
        value={statusId}
        onChange={(e) => setStatusId(e.value)}
        options={issueStatuses!.items}
        name="statusId"
        id="statusId"
        optionValue="id"
        optionLabel="title"
        className="w-full mb-3"
      />

      <label htmlFor="typeId" className="block text-900 font-medium mb-2">Type</label>
      <Dropdown
        value={typeId}
        onChange={(e) => setTypeId(e.value)}
        options={issueTypes!.items}
        name="typeId"
        id="typeId"
        optionValue="id"
        optionLabel="title"
        className="w-full mb-3"
      />

      <label htmlFor="dueDate" className="block text-900 font-medium mb-2">Due date</label>
      <Calendar
        id="dueDate"
        value={defaultIssue?.dueDate ? new Date(defaultIssue?.dueDate) : null}
        name="dueDate"
        required
        className="w-full mb-3"
      />
    </>
  );
}
