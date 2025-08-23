
'use client';

import { AdminProvider } from '@/context/AdminContext';
import { EventProvider } from '@/context/EventContext';
import { TeamProvider } from '@/context/TeamContext';
import { MemberProvider } from '@/context/MemberContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <TeamProvider>
        <EventProvider>
          <MemberProvider>{children}</MemberProvider>
        </EventProvider>
      </TeamProvider>
    </AdminProvider>
  );
}
