'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

type AdminContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isInitialized: boolean; // <-- Expose initialization status
  login: () => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isInitialized]);

  const login = () => {
    // This function is now a placeholder as onAuthStateChanged handles the state.
    // It's kept for semantic consistency in the signin page.
  };

  const logout = async () => {
    await signOut(auth);
    // Redirect to home page after logout
    if (pathname.startsWith('/admin')) {
      router.push('/');
    }
  };

  return (
    <AdminContext.Provider value={{ user, isLoggedIn: !!user, isInitialized, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
