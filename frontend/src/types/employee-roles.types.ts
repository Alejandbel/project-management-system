export const EMPLOYEE_ROLE = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  WORKFORCE: 'workforce',
} as const;

export type Role = typeof EMPLOYEE_ROLE[keyof typeof EMPLOYEE_ROLE];

export type EmployeeRole = {
  id: number;
  title: Role;
  createdAt: Date;
};
