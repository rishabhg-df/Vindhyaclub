'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import type { TeamMember } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAdmin } from './AdminContext';

type TeamContextType = {
  team: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateMember: (updatedMember: TeamMember) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  loading: boolean;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAdmin();
  
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const teamCollection = collection(db, 'team');
      const q = query(teamCollection);
      const querySnapshot = await getDocs(q);
      const fetchedTeam: TeamMember[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setTeam(fetchedTeam);
    } catch (error) {
      console.error('Error fetching team from Firestore:', error);
      setTeam([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchTeam();
    }
  }, [isInitialized, fetchTeam]);

  const addMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'team'), member);
      // Optimistic update
      setTeam(prevTeam => [...prevTeam, { id: docRef.id, ...member }]);
      // Re-fetch to ensure consistency
      await fetchTeam();
    } catch (error) {
      console.error('Error adding member to Firestore:', error);
      throw error;
    }
  };

  const updateMember = async (updatedMember: TeamMember) => {
    try {
      const { id, ...memberData } = updatedMember;
      const memberDoc = doc(db, 'team', id);
      await updateDoc(memberDoc, memberData);
      await fetchTeam();
    } catch (error) {
      console.error('Error updating member in Firestore:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'team', id));
      await fetchTeam();
    } catch (error)      {
      console.error('Error deleting member from Firestore:', error);
      throw error;
    }
  };
  
  return (
    <TeamContext.Provider value={{ team, addMember, updateMember, deleteMember, loading }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
