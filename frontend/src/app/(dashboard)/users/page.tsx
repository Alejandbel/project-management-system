'use client';

import { UsersTable } from './UsersTable';
import { useAuth } from '@/hooks';
import { EMPLOYEE_ROLE } from '@/types';

export default function Page() {
  useAuth('/', [EMPLOYEE_ROLE.ADMIN]);

  return (
    <div className="card">
      <UsersTable />
    </div>
  );
}
