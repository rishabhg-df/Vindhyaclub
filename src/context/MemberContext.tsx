
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
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import type { RegisteredMember, Payment } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';
import { format, parseISO } from 'date-fns';

type MemberContextType = {
  members: RegisteredMember[];
  addRegisteredMember: (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => Promise<void>;
  updateRegisteredMember: (updatedMember: RegisteredMember) => Promise<void>;
  deleteRegisteredMember: (id: string) => Promise<void>;
  payments: Payment[];
  getPaymentsByMember: (memberId: string) => Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  updatePayment: (updatedPayment: Payment) => Promise<void>;
  loading: boolean;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const formatPaymentFromFirestore = (docSnap: any): Payment => {
  const data = docSnap.data();
  // Ensure date is always a string in yyyy-MM-dd format
  const date =
    data.date instanceof Timestamp
      ? format(data.date.toDate(), 'yyyy-MM-dd')
      : data.date;
  const paymentDate =
    data.paymentDate instanceof Timestamp
      ? format(data.paymentDate.toDate(), 'yyyy-MM-dd')
      : data.paymentDate;

  return { id: docSnap.id, ...data, date, paymentDate } as Payment;
};

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();

  const fetchMembers = useCallback(async () => {
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
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const paymentsCollection = collection(db, 'payments');
      const querySnapshot = await getDocs(paymentsCollection);
      const fetchedPayments: Payment[] = querySnapshot.docs.map(
        formatPaymentFromFirestore
      );
      setPayments(fetchedPayments);
    } catch (error) {
      console.error('Error fetching payments from Firestore:', error);
      setPayments([]);
    }
  }, []);

  const seedInitialAdmin = useCallback(async () => {
    try {
      const adminQuery = query(
        collection(db, 'members'),
        where('role', '==', 'admin')
      );
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
            console.warn(
              'Admin user already exists in Auth, but not in Firestore. This might happen on re-runs and is okay.'
            );
          } else {
            throw new Error(
              data.error || 'Failed to create admin user in Firebase Auth.'
            );
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
        await Promise.all([fetchMembers(), fetchPayments()]);
        setLoading(false);
      };
      initializeData();
    }
  }, [isInitialized, fetchMembers, fetchPayments, seedInitialAdmin]);

  const addRegisteredMember = async (
    member: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'>,
    password: string
  ) => {
    try {
      const adminQuery = query(
        collection(db, 'members'),
        where('role', '==', 'admin')
      );
      const adminSnapshot = await getDocs(adminQuery);
      const isFirstMember = adminSnapshot.empty;

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

  const getPaymentsByMember = (memberId: string) => {
    return payments.filter((p) => p.memberId === memberId);
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    try {
      const paymentDataWithTimestamp: any = {
        ...payment,
        date: Timestamp.fromDate(parseISO(payment.date)),
        createdAt: serverTimestamp(),
      };

      if (payment.paymentDate) {
        paymentDataWithTimestamp.paymentDate = Timestamp.fromDate(
          parseISO(payment.paymentDate)
        );
      }

      await addDoc(collection(db, 'payments'), paymentDataWithTimestamp);
      await fetchPayments();
    } catch (error) {
      console.error('Error adding payment:', error);
      throw new Error('Failed to add payment.');
    }
  };

  const updatePayment = async (updatedPayment: Payment) => {
    try {
      const { id, ...paymentData } = updatedPayment;
      const paymentRef = doc(db, 'payments', id);
      const dataToUpdate: any = {
        ...paymentData,
        date: Timestamp.fromDate(parseISO(paymentData.date)),
      };
      if (paymentData.paymentDate) {
        dataToUpdate.paymentDate = Timestamp.fromDate(
          parseISO(paymentData.paymentDate)
        );
      }
      await updateDoc(paymentRef, dataToUpdate);
      await fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
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
        payments,
        getPaymentsByMember,
        addPayment,
        updatePayment,
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
