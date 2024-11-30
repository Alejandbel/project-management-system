'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

import { employeeRolesService } from '@/services/api';
import { UserWithRole } from '@/types';

type UserFormProps = {
  defaultUser?: UserWithRole;
};

export function UserForm({ defaultUser }: UserFormProps) {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['/employee-roles'],
    queryFn: () => employeeRolesService.getRoles(),
  });

  const [selectedRoleId, setSelectedRoleId] = useState<number>();

  if (isLoading || !isSuccess) {
    return null;
  }

  return (
    <>
      <input hidden name="id" value={defaultUser?.id} readOnly />

      <label htmlFor="name" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="name" value={defaultUser?.name} name="name" className="w-full mb-3" required />

      <label htmlFor="key" className="block text-900 font-medium mb-2">Key</label>
      <InputText id="key" value={defaultUser?.email} name="key" required />

      <label htmlFor="startWorksAt" className="block text-900 font-medium mb-2">Start works at</label>
      <Calendar
        id="startWorksAt"
        value={defaultUser?.startWorksAt ? new Date(defaultUser?.startWorksAt) : null}
        name="startWorksAt"
        className="w-full mb-3"
      />

      <label htmlFor="endWorksAt" className="block text-900 font-medium mb-2">End works at</label>
      <Calendar
        id="endWorksAt"
        value={defaultUser?.endWorksAt ? new Date(defaultUser?.endWorksAt) : null}
        name="endWorksAt"
        className="w-full mb-3"
      />

      <label htmlFor="roleId" className="block text-900 font-medium mb-2">Employee role</label>
      <Dropdown
        value={selectedRoleId ?? defaultUser?.roleId}
        onChange={(e) => setSelectedRoleId(e.value)}
        options={data.items}
        name="roleId"
        optionValue="id"
        optionLabel="title"
        className="w-full md:w-14rem"
      />
    </>
  );
}
