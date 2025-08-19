
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { TeamMember } from '@/lib/types';
import { team as initialTeam } from '@/lib/data';

type TeamContextType = {
  team: TeamMember[];
  addMember: (member: TeamMember) => void;
  updateMember: (updatedMember: TeamMember) => void;
  deleteMember: (id: string) => void;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Function to get initial state, trying localStorage first
const getInitialTeam = (): TeamMember[] => {
  if (typeof window === 'undefined') {
    return initialTeam;
  }
  try {
    const storedTeam = localStorage.getItem('vindhya-club-team');
    if (storedTeam) {
      return JSON.parse(storedTeam);
    }
  } catch (error) {
    console.error('Failed to parse team from localStorage', error);
  }
  return initialTeam;
};

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(getInitialTeam);

  useEffect(() => {
    try {
      localStorage.setItem('vindhya-club-team', JSON.stringify(team));
    } catch (error) {
      console.error('Failed to save team to localStorage', error);
    }
  }, [team]);

  const addMember = (member: TeamMember) => {
    setTeam((prevTeam) => [...prevTeam, member]);
  };

  const updateMember = (updatedMember: TeamMember) => {
    setTeam((prevTeam) =>
      prevTeam.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const deleteMember = (id: string) => {
    setTeam((prevTeam) => prevTeam.filter((member) => member.id !== id));
  };
  
  return (
    <TeamContext.Provider value={{ team, addMember, updateMember, deleteMember }}>
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
