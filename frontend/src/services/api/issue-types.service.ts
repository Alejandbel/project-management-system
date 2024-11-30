import axios from './axios';
import { IssueType } from '@/types/issue-types.types';

export const issueTypesService = {
  getIssueTypes: async (): Promise<{ items: IssueType[] }> => {
    const { data } = await axios.get('/issue-types');

    return data;
  },
};
