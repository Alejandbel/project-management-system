export type EmployeeRole = {
  id: number;
  title: EMPLOYEE_ROLE;
  createdAt: Date;
};

export enum EMPLOYEE_ROLE {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  WORKFORCE = 'workforce',
}
