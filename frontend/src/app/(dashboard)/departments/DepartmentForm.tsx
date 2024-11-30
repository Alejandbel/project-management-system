import { InputText } from 'primereact/inputtext';
import React from 'react';

import { Department } from '@/types';

type DepartmentFormProps = {
  defaultDepartment?: Department;
};

export function DepartmentForm({ defaultDepartment }: DepartmentFormProps) {
  return (
    <>
      <input hidden name="id" value={defaultDepartment?.id} readOnly />

      <label htmlFor="title" className="block text-900 font-medium mb-2">Title</label>
      <InputText id="title" defaultValue={defaultDepartment?.title} name="title" className="w-full mb-3" required />
    </>
  );
}
