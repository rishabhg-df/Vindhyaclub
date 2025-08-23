
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
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { Expenditure } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';
import { format } from 'date-fns';

type ExpenditureContextType = {
  expenditures: Expenditure[];
  addExpenditure: (expenditure: Omit<Expenditure, 'id' | 'createdAt'>) => Promise<void>;
  updateExpenditure: (updatedExpenditure: Expenditure) => Promise<void>;
  deleteExpenditure: (id: string) => Promise<void>;
  loading: boolean;
};

const ExpenditureContext = createContext<ExpenditureContextType | undefined>(
  undefined
);

const formatExpenditureFromFirestore = (docSnap: any): Expenditure => {
  const data = docSnap.data();
  const date =
    data.date instanceof Timestamp
      ? format(data.date.toDate(), 'yyyy-MM-dd')
      : data.date;
  return { id: docSnap.id, ...data, date } as Expenditure;
};

export function ExpenditureProvider({ children }: { children: ReactNode }) {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();

  const fetchExpenditures = useCallback(async () => {
    setLoading(true);
    try {
      const expendituresCollection = collection(db, 'expenditures');
      const q = query(expendituresCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedExpenditures: Expenditure[] = querySnapshot.docs.map(
        formatExpenditureFromFirestore
      );
      setExpenditures(fetchedExpenditures);
    } catch (error) {
      console.error('Error fetching expenditures from Firestore:', error);
      setExpenditures([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchExpenditures();
    }
  }, [isInitialized, fetchExpenditures]);

  const addExpenditure = async (expenditure: Omit<Expenditure, 'id' | 'createdAt'>) => {
    try {
      const expenditureData = {
        ...expenditure,
        amount: Number(expenditure.amount),
        date: Timestamp.fromDate(new Date(expenditure.date)),
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'expenditures'), expenditureData);
      await fetchExpenditures();
    } catch (error) {
      console.error('Error adding expenditure:', error);
      throw error;
    }
  };

  const updateExpenditure = async (updatedExpenditure: Expenditure) => {
    try {
      const { id, ...expenditureData } = updatedExpenditure;
      const expenditureRef = doc(db, 'expenditures', id);
      const dataToUpdate = {
        ...expenditureData,
        amount: Number(expenditureData.amount),
        date: Timestamp.fromDate(new Date(expenditureData.date)),
      };
      await updateDoc(expenditureRef, dataToUpdate);
      await fetchExpenditures();
    } catch (error) {
      console.error('Error updating expenditure:', error);
      throw error;
    }
  };

  const deleteExpenditure = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenditures', id));
      await fetchExpenditures();
    } catch (error) {
      console.error('Error deleting expenditure:', error);
      throw error;
    }
  };

  return (
    <ExpenditureContext.Provider
      value={{
        expenditures,
        addExpenditure,
        updateExpenditure,
        deleteExpenditure,
        loading,
      }}
    >
      {children}
    </ExpenditureContext.Provider>
  );
}

export function useExpenditures() {
  const context = useContext(ExpenditureContext);
  if (!context) {
    throw new Error('useExpenditures must be used within an ExpenditureProvider');
  }
  return context;
}
