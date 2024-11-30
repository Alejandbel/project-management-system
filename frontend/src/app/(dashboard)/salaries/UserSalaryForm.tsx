import { InputNumber } from 'primereact/inputnumber';
import React from 'react';

import { UserSalaryWithUser } from '@/types';

type UserSalaryFormProps = {
  defaultSalary?: Pick<UserSalaryWithUser, 'salary' | 'userName' | 'id'>;
};

export function UserSalaryForm({ defaultSalary }: UserSalaryFormProps) {
  return (
    <>
      <input hidden name="id" value={defaultSalary?.id} readOnly />

      <p className="block text-900 font-medium mb-2">{defaultSalary?.userName}</p>

      <label htmlFor="salary" className="block text-900 font-medium mb-2">Salary</label>
      <InputNumber id="salary" defaultValue={defaultSalary?.salary} name="salary" className="w-full mb-3" required />
    </>
  );
}
