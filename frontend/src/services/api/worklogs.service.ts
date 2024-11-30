import axios from '@/services/api/axios';
import { Worklog } from '@/types/worklogs.types';

export const worklogsService = {
  createWorklog: async (worklog: Partial<Worklog>) => {
    await axios.post('/worklogs', worklog);
  },
};
