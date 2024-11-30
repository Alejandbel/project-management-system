import axios from './axios';
import { EmployeeRole } from '@/types/employee-roles.types';

export const employeeRolesService = {
  getRoles: async (): Promise<{ items: EmployeeRole[] }> => {
    const { data } = await axios.get('/employee-roles');

    return data;
  },
};
