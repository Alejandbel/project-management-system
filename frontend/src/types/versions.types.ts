import { IssueWithTypeStatusTotalTime } from './issues.types';

export type Version = {
  id: number;
  title: string;
  isArchived: boolean;
  projectId: number;
  startDate: Date;
  releaseDate?: Date | null;
  createdAt: Date;
};

export type VersionWithIssues = Version & { issues: IssueWithTypeStatusTotalTime[] };

export type VersionToCreate = Omit<Version, 'id' | 'createdAt'>;
