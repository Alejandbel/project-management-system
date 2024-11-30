import axios from './axios';
import { SortDirection, User, UserWithRole } from '@/types';

export const usersService = {
  getUsers: async (params: {
    sortField?: string,
    sortDirection?: SortDirection,
    limit?: number,
    offset?: number
  } = {}, cookie?: string): Promise<{ items: UserWithRole[], count: number }> => {
    const { data } = await axios.get('/users', {
      params,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    return data;
  },

  getSelf: async (): Promise<UserWithRole> => {
    const { data } = await axios.get('/users/me');

    return data;
  },

  updateUser: async (id: number, user: Pick<User, 'endWorksAt' | 'startWorksAt' | 'roleId'>) => {
    await axios.patch(`/users/${id}`, user);
  },
};
