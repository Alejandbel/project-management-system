'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { authService } from '@/services/api';
import { handleAxiosErrorMessageToast } from '@/utils/toast.utils';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const effect = async () => {
      await authService.signOut().catch(handleAxiosErrorMessageToast);
      router.push('/sign-in');
    };

    void effect();
  }, [router]);

  return null;
}
