import { SortDirection } from '@modules/core';

export type Department = {
  id: number;
  title: string;
  createdAt: Date;
};

export type DepartmentToUpdate = Pick<Department, 'title'>;

export type DepartmentListOptions = {
  sortField: DEPARTMENT_SORT_FIELD;
  sortDirection: SortDirection;
};

export enum DEPARTMENT_SORT_FIELD {
  ID = 'id',
  TITLE = 'title',
}
