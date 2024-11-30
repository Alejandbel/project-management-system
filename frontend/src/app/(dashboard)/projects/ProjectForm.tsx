import { useQuery } from '@tanstack/react-query';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { departmentsService, usersService } from '@/services/api';
import { Project } from '@/types/projects.types';

type ProjectFormProps = {
  defaultProject?: Project;
};

function useProjectForm() {
  const { data: departments, isSuccess: isDepartmentsSuccess, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['/departments'],
    queryFn: () => departmentsService.getDepartments(),
  });

  const { data: users, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/users'],
    queryFn: () => usersService.getUsers(),
  });

  return {
    departments,
    users,
    isLoading: isDepartmentsLoading || isUsersLoading,
    isSuccess: isDepartmentsSuccess && isUsersSuccess,
  };
}

export function ProjectForm({ defaultProject }: ProjectFormProps) {
  const {
    departments, users, isLoading, isSuccess,
  } = useProjectForm();

  const [leadId, setLeadId] = useState(defaultProject?.leadId);
  const [departmentId, setDepartmentId] = useState(defaultProject?.departmentId);

  if (!isSuccess || isLoading) {
    return null;
  }

  return (
    <>
      <input hidden name="id" value={defaultProject?.id} readOnly />

      <label htmlFor="name" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="name" defaultValue={defaultProject?.name} name="name" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" defaultValue={defaultProject?.key} name="key" required />

      <label htmlFor="leadId" className="block text-900 font-medium mb-2">Lead</label>
      <Dropdown
        value={leadId}
        onChange={(e) => setLeadId(e.value)}
        options={users!.items}
        name="leadId"
        id="leadId"
        optionValue="id"
        optionLabel="name"
        className="w-full mb-3"
      />

      <label htmlFor="departmentId" className="block text-900 font-medium mb-2">Department</label>
      <Dropdown
        value={departmentId}
        onChange={(e) => setDepartmentId(e.value)}
        options={departments!.items}
        id="departmentId"
        name="departmentId"
        optionValue="id"
        optionLabel="title"
        className="w-full mb-3"
      />
    </>
  );
}
