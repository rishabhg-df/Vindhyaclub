
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, serverTimestamp, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
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
    try {
      await addRegisteredMember(initialAdminData, 'password');
      console.log('Initial admin user created successfully.');
    } catch(error) {
        console.error('Error seeding initial admin user:', error);
        // It might be that the auth user already exists from a failed previous attempt.
        // We'll proceed to fetch members again, and if login still fails, there's another issue.
    }
    await fetchMembers(true); // Refetch after seeding
  }, []); // Removed addRegisteredMember and fetchMembers from dependencies to break cycle.

  const fetchMembers = useCallback(async (forceRefetch = false) => {
    if (!forceRefetch) {
      setLoading(true);
    }
    try {
      const membersCollection = collection(db, 'members');
      
      // Check if an admin exists
      const adminQuery = query(membersCollection, where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        // No admin user found, so we must create one.
        await seedInitialAdmin();
        return; // seedInitialAdmin will trigger a refetch, so we exit here.
      }
      
      // Admin exists, proceed to fetch all members
      const allMembersSnapshot = await getDocs(membersCollection);
      const fetchedMembers: RegisteredMember[] = allMembersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegisteredMember));
      setMembers(fetchedMembers);

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
      // Note: This does not delete the Firebase Auth user.
      // For a production app, you would want to implement a cloud function to handle this.
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
