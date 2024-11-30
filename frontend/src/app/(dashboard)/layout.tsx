import React from 'react';

import 'primeflex/primeflex.css';

import { Header } from './Header';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow-1 m-2">
        {children}
      </main>
    </>
  );
}
