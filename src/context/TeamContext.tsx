'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import type { TeamMember } from '@/lib/types';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAdmin } from './AdminContext';

type TeamContextType = {
  team: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id' | 'image'>, imageFile?: File) => Promise<void>;
  updateMember: (updatedMember: TeamMember, imageFile?: File) => Promise<void>;
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

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `team/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addMember = async (member: Omit<TeamMember, 'id' | 'image'>, imageFile?: File) => {
    try {
      let imageUrl = 'https://placehold.co/128x128.png';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const memberData = {
        ...member,
        image: imageUrl,
      };

      await addDoc(collection(db, 'team'), memberData);
      await fetchTeam();
    } catch (error) {
      console.error('Error adding member to Firestore:', error);
      throw error;
    }
  };

  const updateMember = async (updatedMember: TeamMember, imageFile?: File) => {
    try {
      const { id, ...memberData } = updatedMember;
      
      let imageUrl = memberData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const memberDoc = doc(db, 'team', id);
      await updateDoc(memberDoc, { ...memberData, image: imageUrl });
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
