'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Section } from '@/components/shared/Section';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, isInitialized } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once Firebase auth has been initialized
    if (isInitialized && !isLoggedIn) {
      router.push('/signin');
    }
  }, [isInitialized, isLoggedIn, router]);

  // While Firebase is initializing, show a loading state
  if (!isInitialized) {
    return (
      <Section title="">
        <div className="flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Loading Admin Dashboard...
          </p>
        </div>
      </Section>
    );
  }

  // If initialized and still not logged in, render nothing to avoid flashing content
  if (!isLoggedIn) {
    return null;
  }

  // If initialized and logged in, show the admin content
  return <>{children}</>;
}
