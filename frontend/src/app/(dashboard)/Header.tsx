'use client';

import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

import { useAuth } from '@/hooks';
import { EMPLOYEE_ROLE } from '@/types';

export function Header() {
  const router = useRouter();
  const { user } = useAuth('/sign-in');

  if (!user) {
    return null;
  }

  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => router.push('/'),
    },
    ...(user.role === EMPLOYEE_ROLE.ADMIN ? [{
      label: 'Users',
      command: () => router.push('/users'),
    }] : []),
    {
      label: 'Departments',
      command: () => router.push('/departments'),
    },
    {
      label: 'Projects',
      command: () => router.push('/projects'),
    },
    ...(user.role === EMPLOYEE_ROLE.ADMIN ? [{
      label: 'Salaries',
      command: () => router.push('/salaries'),
    }] : []),
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/logout'),
    },
  ];

  return (
    <div>
      <TabMenu model={items} />
    </div>
  );
}
