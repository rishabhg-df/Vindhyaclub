
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Section } from '@/components/shared/Section';
import { Loader2 } from 'lucide-react';

export default function MemberLayout({ children }: { children: ReactNode }) {
  const { role, isInitialized } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (role !== 'member') {
        router.push('/signin');
      }
    }
  }, [isInitialized, role, router]);

  if (!isInitialized) {
    return (
      <Section title="">
        <div className="flex min-h-[calc(100vh-20rem)] flex-col items-center justify-center text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Loading Member Dashboard...
          </p>
        </div>
      </Section>
    );
  }

  if (role !== 'member') {
    return null;
  }

  return <>{children}</>;
}
