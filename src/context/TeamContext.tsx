
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

// Helper to remove base64 image data before saving to localStorage
const getTeamForStorage = (team: TeamMember[]): TeamMember[] => {
    return team.map(member => {
        if (member.image.startsWith('data:image')) {
            const originalMember = initialTeam.find(m => m.id === member.id);
            return { ...member, image: originalMember ? originalMember.image : 'https://placehold.co/128x128.png' };
        }
        return member;
    });
};


export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTeam = localStorage.getItem('teamData');
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
      } else {
        setTeam(initialTeam);
      }
    } catch (error) {
      console.error('Failed to parse team data from localStorage', error);
      setTeam(initialTeam);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const storableTeam = getTeamForStorage(team);
        localStorage.setItem('teamData', JSON.stringify(storableTeam));
      } catch (error) {
        console.error('Failed to save team data to localStorage', error);
      }
    }
  }, [team, isInitialized]);
  

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

  if (!isInitialized) {
    return null;
  }

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
