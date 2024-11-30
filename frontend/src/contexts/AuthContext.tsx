'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { usersService } from '@/services/api';
import { UserWithRole } from '@/types';

export const AuthContext = React.createContext<{ user?: UserWithRole | null }>({});

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/users/me'],
    queryFn: () => usersService.getSelf().catch(() => null),
  });

  const value = useMemo(() => ({
    user,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
