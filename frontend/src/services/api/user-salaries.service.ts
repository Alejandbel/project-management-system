import axios from './axios';
import { UserSalary, UserSalaryWithUser } from '@/types';

export const userSalariesService = {
  getSalaries: async (params: {
    month: number,
    year: number,
  }): Promise<{ items: UserSalaryWithUser[], count: number }> => {
    const { data } = await axios.get('/user-salaries', {
      params,
    });

    return data;
  },

  updateSalary: async (id: number, salary: Pick<UserSalary, 'salary'>) => {
    await axios.patch(`/user-salaries/${id}`, salary);
  },
};
