
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

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTeam = localStorage.getItem('vindhya-club-team');
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
      } else {
        setTeam(initialTeam);
      }
    } catch (error) {
       console.error('Failed to load team from localStorage', error);
       setTeam(initialTeam);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
       try {
        // We only store text data to avoid quota errors. 
        // Newly added images will not persist on refresh.
        const teamToStore = team.map(member => {
            const { image, ...rest } = member;
            // Only keep image URL if it's not a base64 string
            const imageToKeep = (typeof image === 'string' && image.startsWith('http')) ? image : 'https://placehold.co/128x128.png';
            return {...rest, image: imageToKeep };
        });
        localStorage.setItem('vindhya-club-team', JSON.stringify(teamToStore));
      } catch (error) {
        console.error('Failed to save team to localStorage', error);
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
