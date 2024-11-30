import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Role, UserWithRole } from '@/types';

export function useAuth(): { user: UserWithRole | null };
export function useAuth(redirect: string, allowedRoles?: Role[]): { user: UserWithRole | null };
export function useAuth(redirect?: string, allowedRoles?: Role[]) {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const userHasNoAccess = !user || (allowedRoles && !allowedRoles.includes(user.role));

    if (redirect && userHasNoAccess) {
      router.push(redirect);
    }
  }, [router, redirect, user, allowedRoles]);

  return { user };
}
