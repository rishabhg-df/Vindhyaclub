'use client';

import { AdminProvider } from '@/context/AdminContext';
import { EventProvider } from '@/context/EventContext';
import { TeamProvider } from '@/context/TeamContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <TeamProvider>
        <EventProvider>{children}</EventProvider>
      </TeamProvider>
    </AdminProvider>
  );
}
