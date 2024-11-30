import axios from '@/services/api/axios';
import { Issue } from '@/types';

export const issuesService = {
  createIssue: async (issue: Partial<Issue>) => {
    await axios.post('/issues', issue);
  },

  updateIssue: async (id: number, issue: Partial<Issue>) => {
    await axios.patch(`/issues/${id}`, issue);
  },
};
