export type Issue = {
  id: number;
  typeId: number;
  key: string;
  summary: string;
  versionId: number;
  hoursEstimated: number;
  assigneeId: number;
  dueDate: Date;
  description: string;
  statusId: number;
  createdAt: Date;
};

export type IssueWithTypeStatusTotalTime = Issue & {
  type: string;
  status: string;
  totalTimeSpent: number;
};
