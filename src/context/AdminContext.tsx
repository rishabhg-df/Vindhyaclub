
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import type { RegisteredMember } from '@/lib/types';

type AdminContextType = {
  user: User | null;
  profile: RegisteredMember | null;
  role: 'admin' | 'member' | null;
  isLoggedIn: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<RegisteredMember | null>(null);
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchProfile = useCallback(async (user: User) => {
    if (user) {
      try {
        const memberDoc = await getDoc(doc(db, 'members', user.uid));
        if (memberDoc.exists()) {
          const memberData = { id: memberDoc.id, ...memberDoc.data() } as RegisteredMember;
          setProfile(memberData);
          setRole(memberData.role);
        } else {
          setProfile(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfile(null);
        setRole(null);
      }
    } else {
      setProfile(null);
      setRole(null);
    }
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setIsInitialized(true); // If no user, we are still initialized
        setProfile(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, [fetchProfile]);
  
  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    fetchProfile(loggedInUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setRole(null);
    
    if (pathname.startsWith('/admin') || pathname.startsWith('/member')) {
      router.push('/');
    }
  };

  return (
    <AdminContext.Provider value={{ user, profile, role, isLoggedIn: !!user, isInitialized, login, logout }}>
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
