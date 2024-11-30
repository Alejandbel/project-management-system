'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/contexts/AuthContext';

function Providers({ children }: React.PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <PrimeReactProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{ duration: 3000 }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </PrimeReactProvider>
  );
}

export default Providers;
