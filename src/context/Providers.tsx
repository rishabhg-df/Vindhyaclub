
'use client';

import { AdminProvider } from '@/context/AdminContext';
import { EventProvider } from '@/context/EventContext';
import { TeamProvider } from '@/context/TeamContext';
import { LocationProvider } from '@/context/LocationContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <TeamProvider>
        <LocationProvider>
          <EventProvider>{children}</EventProvider>
        </LocationProvider>
      </TeamProvider>
    </AdminProvider>
  );
}
