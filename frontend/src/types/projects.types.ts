export type Project = {
  id: number;
  key: string;
  name: string;
  leadId?: number | null;
  departmentId: number;
  createdAt: string;
};

export type ProjectWithRelations = Project & {
  lead?: string | null;
  department: string;
};
