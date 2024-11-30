import axios from './axios';
import { SortDirection, VersionToCreate, VersionWithIssues } from '@/types';

export const versionsService = {
  getVersions: async (params: {
    sortField?: string,
    sortDirection?: SortDirection,
    limit?: number,
    offset?: number,
    projectId?: number,
  } = {}): Promise<{ items: VersionWithIssues[], count: number }> => {
    const { data } = await axios.get('/versions', {
      params,
    });

    return data;
  },

  createVersion: async (version: VersionToCreate) => {
    await axios.post('/versions', version);
  },

  updateVersion: async (id: number, version: Partial<VersionToCreate>) => {
    await axios.patch(`/versions/${id}`, version);
  },

  deleteVersion: async (id: number) => {
    await axios.delete(`/versions/${id}`);
  },
};
