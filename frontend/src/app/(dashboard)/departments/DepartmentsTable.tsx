'use client';

import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';
import { z } from 'zod';

import { DepartmentForm } from './DepartmentForm';
import { Table, TableColumn } from '@/components/Table';
import { useAuth } from '@/hooks';
import { departmentsService } from '@/services/api';
import {
  Department, EMPLOYEE_ROLE, Role, SortDirection,
} from '@/types';
import { validateForm } from '@/utils';

export const departmentBodySchema = z
  .object({
    id: z.preprocess(Number, z.number())
      .optional(),
    title: z.string()
      .max(255),
  })
  .strip();

export function DepartmentsTable() {
  const { user } = useAuth('/sign-in');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(SortDirection.ASC);
  const [limit, setLimit] = useState<number | undefined>(5);
  const [offset, setOffset] = useState<number | undefined>(0);

  const {
    data,
    isSuccess,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/departments', sortField, sortDirection, limit, offset],
    queryFn: () => departmentsService.getDepartments({
      sortField,
      sortDirection,
      limit,
      offset,
    }),
  });

  if (!isSuccess || isLoading || error || !user) {
    return null;
  }

  const columns: TableColumn<Department>[] = [
    {
      field: 'id',
      header: 'Id',
      type: 'numeric',
      sortable: true,
    },
    {
      field: 'title',
      header: 'Title',
      type: 'string',
      sortable: true,
    },
  ];

  const onStateChange = (filed: string, direction?: SortDirection, limitState?: number, offsetState?: number) => {
    setSortField(filed);
    setSortDirection(direction);
    setLimit(limitState);
    setOffset(offsetState);
  };

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const department = validateForm(event.currentTarget, departmentBodySchema);

    if (department.id) {
      await departmentsService.updateDepartment(department.id, department);
    } else {
      await departmentsService.createDepartment(department);
    }

    await refetch();
  };

  const onDelete = async (item?: Department) => {
    if (item?.id) {
      await departmentsService.deleteDepartment(item.id);
      await refetch();
    }
  };

  const form = (department?: Department) => <DepartmentForm defaultDepartment={department} />;

  return (
    <Table
      items={data.items}
      limit={limit}
      offset={offset}
      totalRecords={data.count}
      onStateChange={onStateChange}
      columns={columns}
      defaultSortField={sortField}
      defaultSortOrder={sortDirection}
      limitStep={5}
      onSave={onSave}
      onDelete={user.role === EMPLOYEE_ROLE.ADMIN ? onDelete : undefined}
      dialogForm={form}
      actions={([EMPLOYEE_ROLE.ADMIN] as Role[]).includes(user.role) ? ['update', 'create'] : []}
    />
  );
}
