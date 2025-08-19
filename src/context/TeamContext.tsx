
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { TeamMember } from '@/lib/types';
import { db } from '@/lib/firebase';
import { team as initialTeam } from '@/lib/data';

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
  const [isInitialized, setIsInitialized] = useState(false);
  
  const fetchTeam = async () => {
    try {
      const teamCollection = collection(db, 'team');
      const querySnapshot = await getDocs(teamCollection);
      const fetchedTeam: TeamMember[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTeam.push({ id: doc.id, ...doc.data() } as TeamMember);
      });

      if (fetchedTeam.length === 0) {
        // If no team members in Firestore, populate with initial data
        const initialDataPromises = initialTeam.map(member => addDoc(collection(db, 'team'), member));
        await Promise.all(initialDataPromises);
        // Re-fetch after populating
        const newSnapshot = await getDocs(teamCollection);
        newSnapshot.forEach((doc) => {
          fetchedTeam.push({ id: doc.id, ...doc.data() } as TeamMember);
        });
      }
      setTeam(fetchedTeam);
    } catch (error) {
      console.error('Error fetching team from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      fetchTeam();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'team'), member);
      setTeam((prevTeam) => [...prevTeam, { id: docRef.id, ...member }]);
    } catch (error) {
      console.error('Error adding member to Firestore:', error);
    }
  };

  const updateMember = async (updatedMember: TeamMember) => {
    try {
      const memberDoc = doc(db, 'team', updatedMember.id);
      await updateDoc(memberDoc, updatedMember);
      setTeam((prevTeam) =>
        prevTeam.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
    } catch (error) {
      console.error('Error updating member in Firestore:', error);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'team', id));
      setTeam((prevTeam) => prevTeam.filter((member) => member.id !== id));
    } catch (error) {
      console.error('Error deleting member from Firestore:', error);
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
