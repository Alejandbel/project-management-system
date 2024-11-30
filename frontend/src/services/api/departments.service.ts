import axios from './axios';
import { Department, SortDirection } from '@/types';

export const departmentsService = {
  getDepartments: async (params: {
    sortField?: string,
    sortDirection?: SortDirection,
    limit?: number,
    offset?: number
  } = {}): Promise<{ items: Department[], count: number }> => {
    const { data } = await axios.get('/departments', {
      params,
    });

    return data;
  },

  createDepartment: async (department: Pick<Department, 'title'>) => {
    await axios.post('/departments', department);
  },

  updateDepartment: async (id: number, department: Pick<Department, 'title'>) => {
    await axios.patch(`/departments/${id}`, department);
  },

  deleteDepartment: async (id: number) => {
    await axios.delete(`/departments/${id}`);
  },
};
