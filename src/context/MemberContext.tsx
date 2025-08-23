
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, serverTimestamp, setDoc, updateDoc, deleteDoc, query, where, addDoc } from 'firebase/firestore';
import type { RegisteredMember } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';

type MemberContextType = {
  members: RegisteredMember[];
  addRegisteredMember: (member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>, password: string) => Promise<void>;
  updateRegisteredMember: (updatedMember: RegisteredMember) => Promise<void>;
  deleteRegisteredMember: (id: string) => Promise<void>;
  loading: boolean;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();
  
  const addRegisteredMember = async (member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>, password: string) => {
    try {
      // 1. Create Firebase Auth user
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: member.email, password, displayName: member.name }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user in Firebase Auth.');
      }
      
      const uid = data.uid;

      // 2. Create Firestore document with UID as the ID
      const memberDocRef = doc(db, 'members', uid);
      await setDoc(memberDocRef, {
        ...member,
        uid: uid,
        createdAt: serverTimestamp(),
      });
      
      await fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const seedInitialAdmin = useCallback(async () => {
    try {
      console.log('No admin user found. Seeding initial admin...');
      const initialAdminData = {
        name: 'Vindhya Club Admin',
        email: 'admin@example.com',
        phone: '0000000000',
        address: 'Vindhya Club',
        dateOfJoining: new Date().toISOString().split('T')[0],
        role: 'admin' as const,
        photoUrl: 'https://placehold.co/128x128.png',
        imageHint: 'admin portrait',
      };
      await addRegisteredMember(initialAdminData, 'password');
      console.log('Initial admin user created successfully.');
    } catch (error) {
      console.error('Error seeding initial admin user:', error);
    }
  }, []); // addRegisteredMember is not a stable dependency so we omit it

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const membersCollection = collection(db, 'members');
      const querySnapshot = await getDocs(membersCollection);
      const fetchedMembers: RegisteredMember[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegisteredMember));
      if (fetchedMembers.length === 0) {
        // We call seed directly, and it will call fetchMembers again after it's done.
        // This avoids state update issues.
        await seedInitialAdmin();
      } else {
         // Check if an admin exists, if not, seed one.
        const adminExists = fetchedMembers.some(member => member.role === 'admin');
        if (!adminExists) {
            await seedInitialAdmin();
        } else {
            setMembers(fetchedMembers);
        }
      }
    } catch (error) {
      console.error('Error fetching members from Firestore:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [seedInitialAdmin]);

  useEffect(() => {
    if (isInitialized) {
      fetchMembers();
    }
  }, [isInitialized, fetchMembers]);

  const updateRegisteredMember = async (updatedMember: RegisteredMember) => {
    try {
      const { id, ...memberData } = updatedMember;
      const memberDoc = doc(db, 'members', id);
      await updateDoc(memberDoc, memberData);
      await fetchMembers();
    } catch (error) {
      console.error('Error updating member in Firestore:', error);
      throw error;
    }
  };

  const deleteRegisteredMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      await fetchMembers();
    } catch (error)      {
      console.error('Error deleting member from Firestore:', error);
      throw error;
    }
  };
  
  return (
    <MemberContext.Provider value={{ members, addRegisteredMember, updateRegisteredMember, deleteRegisteredMember, loading }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}
