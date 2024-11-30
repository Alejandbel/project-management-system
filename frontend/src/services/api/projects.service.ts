import axios from './axios';
import { Project, ProjectWithRelations, SortDirection } from '@/types';

export const projectsService = {
  getProjects: async (params: {
    sortField?: string,
    sortDirection?: SortDirection,
    limit?: number,
    offset?: number
  } = {}): Promise<{ items: ProjectWithRelations[], count: number }> => {
    const { data } = await axios.get('/projects', {
      params,
    });

    return data;
  },

  getProject: async (id: number): Promise<Project> => {
    const { data } = await axios.get(`/projects/${id}`);

    return data;
  },

  createProject: async (project: Pick<Project, 'name' | 'key' | 'departmentId' | 'leadId'>) => {
    await axios.post('/projects', project);
  },

  updateProject: async (id: number, project: Pick<Project, 'name' | 'key' | 'departmentId' | 'leadId'>) => {
    await axios.patch(`/projects/${id}`, project);
  },
};
