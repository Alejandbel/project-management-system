export type UserSalary = {
  id: number;
  userId: number;
  salary: number;
  period: Date;
  createdAt: Date;
};

export type UserSalaryWithUser = UserSalary & {
  userName: string;
};
