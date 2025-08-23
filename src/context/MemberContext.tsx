'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import {
  collection,
  getDocs,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import type { RegisteredMember } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';

type MemberContextType = {
  members: RegisteredMember[];
  addRegisteredMember: (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => Promise<void>;
  updateRegisteredMember: (updatedMember: RegisteredMember) => Promise<void>;
  deleteRegisteredMember: (id: string) => Promise<void>;
  loading: boolean;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const membersCollection = collection(db, 'members');
      const q = query(collection(db, 'members'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(q);

      if (adminSnapshot.empty) {
        // This is a failsafe. The primary way to create the user is now the Add Member form.
        // This will only run if the database is truly empty and no admin exists.
        console.log('No admin found. You can log in with an admin account and it will be created, or add one from an existing admin account.');
      }
      
      const querySnapshot = await getDocs(membersCollection);
      const fetchedMembers: RegisteredMember[] = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RegisteredMember)
      );
      setMembers(fetchedMembers);
    } catch (error) {
      console.error('Error fetching members from Firestore:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchMembers();
    }
  }, [isInitialized, fetchMembers]);

  const addRegisteredMember = async (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => {
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: member.email,
          password,
          displayName: member.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to create user in Firebase Auth.'
        );
      }

      const uid = data.uid;
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
    } catch (error) {
      console.error('Error deleting member from Firestore:', error);
      throw error;
    }
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        addRegisteredMember,
        updateRegisteredMember,
        deleteRegisteredMember,
        loading,
      }}
    >
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
