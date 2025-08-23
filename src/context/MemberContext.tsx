
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
  arrayUnion,
} from 'firebase/firestore';
import type { RegisteredMember, Payment } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';
import { v4 as uuidv4 } from 'uuid';

type MemberContextType = {
  members: RegisteredMember[];
  addRegisteredMember: (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => Promise<void>;
  updateRegisteredMember: (updatedMember: RegisteredMember) => Promise<void>;
  deleteRegisteredMember: (id: string) => Promise<void>;
  addPayment: (
    memberId: string,
    payment: Omit<Payment, 'id'>
  ) => Promise<void>;
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
      const querySnapshot = await getDocs(membersCollection);
      const fetchedMembers: RegisteredMember[] = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RegisteredMember)
      );
      setMembers(fetchedMembers);
      return fetchedMembers; // Return for seeding check
    } catch (error) {
      console.error('Error fetching members from Firestore:', error);
      setMembers([]);
      return []; // Return empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  const seedInitialAdmin = useCallback(async () => {
    try {
      const q = query(collection(db, 'members'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(q);

      if (adminSnapshot.empty) {
        console.log('No admin found. Seeding initial admin...');
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin12';

        const response = await fetch('/api/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword,
            displayName: 'Admin',
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          if (data.error.includes('auth/email-already-exists')) {
            console.warn(
              'Admin user already exists in Auth, but not in Firestore. This should be handled manually.'
            );
          } else {
            throw new Error(
              data.error || 'Failed to create admin user in Firebase Auth.'
            );
          }
        } else {
          const uid = data.uid;
          const adminData = {
            uid: uid,
            name: 'Admin User',
            email: adminEmail,
            role: 'admin' as const,
            phone: '0000000000',
            address: 'Clubhouse',
            dateOfJoining: new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
            services: [],
            payments: [],
          };
          await setDoc(doc(db, 'members', uid), adminData);
          console.log('Default admin created successfully.');
        }
      }
    } catch (error) {
      console.error('Error seeding initial admin:', error);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const initializeData = async () => {
        await seedInitialAdmin();
        await fetchMembers();
      };
      initializeData();
    }
  }, [isInitialized, fetchMembers, seedInitialAdmin]);

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

      const memberPayload: Omit<RegisteredMember, 'id'> = {
        ...member,
        uid: uid,
        createdAt: serverTimestamp(),
        services: member.services || [],
        payments: member.payments || [],
      };

      if (!member.dob) {
        delete (memberPayload as Partial<RegisteredMember>).dob;
      }

      await setDoc(memberDocRef, memberPayload);

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

      const updatePayload = { ...memberData };
      if (!updatePayload.dob) {
        delete (updatePayload as Partial<RegisteredMember>).dob;
      }

      await updateDoc(memberDoc, updatePayload);
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

  const addPayment = async (
    memberId: string,
    payment: Omit<Payment, 'id'>
  ) => {
    try {
      const memberRef = doc(db, 'members', memberId);
      const newPayment = { ...payment, id: uuidv4() };
      await updateDoc(memberRef, {
        payments: arrayUnion(newPayment),
      });
      await fetchMembers();
    } catch (error) {
      console.error('Error adding payment:', error);
      throw new Error('Failed to add payment.');
    }
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        addRegisteredMember,
        updateRegisteredMember,
        deleteRegisteredMember,
        addPayment,
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
