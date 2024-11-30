'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent } from 'react';
import { z } from 'zod';

import { UserSalaryForm } from './UserSalaryForm';
import { Table, TableColumn } from '@/components/Table';
import { useAuth } from '@/hooks';
import { userSalariesService } from '@/services/api';
import { EMPLOYEE_ROLE, UserSalaryWithUser } from '@/types';
import { validateForm } from '@/utils';

export const userSalaryBodySchema = z
  .object({
    id: z.coerce.number(),
    salary: z.coerce.number(),
  })
  .strip();

type UserSalariesTableProps = {
  month: number;
  year: number;
};

export function UserSalariesTable({ month, year }: UserSalariesTableProps) {
  useAuth('/', [EMPLOYEE_ROLE.ADMIN]);

  const {
    data,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/user-salaries', month, year],
    queryFn: () => userSalariesService.getSalaries({
      month,
      year,
    }),
  });

  if (!isSuccess || isLoading || error) {
    return null;
  }

  const columns: TableColumn<UserSalaryWithUser>[] = [
    { field: 'id', header: 'Id', type: 'numeric' },
    { field: 'userName', header: 'User name', type: 'string' },
    { field: 'salary', header: 'Salary', type: 'numeric' },
  ];

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userSalary = validateForm(event.currentTarget, userSalaryBodySchema);

    if (userSalary.id) {
      await userSalariesService.updateSalary(userSalary.id, userSalary);
    }

    await refetch();
  };

  const form = (userSalary?: UserSalaryWithUser) => <UserSalaryForm defaultSalary={userSalary} />;

  return (
    <Table
      scrollable
      paginate={false}
      items={data.items}
      columns={columns}
      onSave={onSave}
      dialogForm={form}
      actions={['update']}
    />
  );
}
