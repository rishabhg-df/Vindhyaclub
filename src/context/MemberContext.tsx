
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
  getDoc,
} from 'firebase/firestore';
import type { RegisteredMember, Payment } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

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
    } catch (error) {
      console.error('Error fetching members from Firestore:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const seedInitialAdmin = useCallback(async () => {
    try {
      const adminQuery = query(collection(db, 'members'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(adminQuery);

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
            displayName: 'Admin User',
          }),
        });
        
        const data = await response.json();

        if (!response.ok) {
           if (data.error && data.error.includes('auth/email-already-exists')) {
            console.warn('Admin user already exists in Auth, but not in Firestore. This might happen on re-runs and is okay.');
            // Try to find the user in auth to get UID and create firestore doc
            // This part is complex to handle from client-side. Assuming for now this is a one-time seed.
          } else {
            throw new Error(data.error || 'Failed to create admin user in Firebase Auth.');
          }
        }
        
        if (data.uid) {
           const adminData = {
            uid: data.uid,
            name: 'Admin User',
            email: adminEmail,
            role: 'admin' as const,
            phone: '0000000000',
            address: 'Clubhouse',
            dateOfJoining: format(new Date(), 'yyyy-MM-dd'),
            createdAt: serverTimestamp(),
            services: [],
            payments: [],
          };
          await setDoc(doc(db, 'members', data.uid), adminData);
          console.log('Default admin created successfully.');
          await fetchMembers();
        }
      }
    } catch (error) {
      console.error('Error seeding initial admin:', error);
    }
  }, [fetchMembers]);


  useEffect(() => {
    if (isInitialized) {
      const initializeData = async () => {
        setLoading(true);
        await seedInitialAdmin();
        await fetchMembers();
        setLoading(false);
      };
      initializeData();
    }
  }, [isInitialized, fetchMembers, seedInitialAdmin]);
  
  const addRegisteredMember = async (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => {
    try {
      // Check if this is the first member being added
      const membersQuery = query(collection(db, 'members'));
      const memberSnapshot = await getDocs(membersQuery);
      const isFirstMember = memberSnapshot.empty;
  
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
      
      const role = isFirstMember ? 'admin' : member.role;

      const memberPayload: Omit<RegisteredMember, 'id'> = {
        ...member,
        uid: uid,
        role: role,
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

      // Create a mutable copy to potentially delete the dob field
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
    // Note: This does not delete the Firebase Auth user.
    // That requires a backend function for security reasons.
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
