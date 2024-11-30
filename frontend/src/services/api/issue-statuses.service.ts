import axios from './axios';
import { IssueStatus } from '@/types/issue-statuses.types';

export const issueStatusesService = {
  getIssueStatuses: async (): Promise<{ items: IssueStatus[] }> => {
    const { data } = await axios.get('/issue-statuses');

    return data;
  },
};
