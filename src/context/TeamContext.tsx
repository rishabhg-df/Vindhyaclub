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

const getInitialTeam = (): TeamMember[] => {
  if (typeof window !== 'undefined') {
    try {
      const storedTeam = localStorage.getItem('teamData');
      if (storedTeam) {
        return JSON.parse(storedTeam);
      }
    } catch (error) {
      console.error('Failed to parse team data from localStorage', error);
      // Fallback to initialTeam if localStorage is corrupt
      return initialTeam;
    }
  }
  return initialTeam;
};


export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(getInitialTeam);

  useEffect(() => {
    try {
      localStorage.setItem('teamData', JSON.stringify(team));
    } catch (error) {
      console.error('Failed to save team data to localStorage', error);
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
