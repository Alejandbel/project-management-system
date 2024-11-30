import React from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-grow-1 m-2">
      {children}
    </main>
  );
}
