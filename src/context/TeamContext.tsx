
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

// Helper function to safely get data from localStorage
const getInitialTeamState = (): TeamMember[] => {
  try {
    const item = window.localStorage.getItem('team');
    // Parse the stored JSON data. If it doesn't exist, return the initial hardcoded data.
    // Also, ensure we don't persist the image data for new items to avoid storage issues.
    return item ? JSON.parse(item).map((member: TeamMember) => ({...member, image: member.id.startsWith('new-') ? '' : member.image})) : initialTeam;
  } catch (error) {
    console.warn('Error reading team from localStorage', error);
    return initialTeam;
  }
};


export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>(getInitialTeamState);

  // Save to localStorage whenever the team state changes.
  useEffect(() => {
    try {
       // When saving, create a version of the data that does not include the large image strings
       // for any items that were added by the user.
       const teamToStore = team.map(member => {
        const { ...memberWithoutImage } = member;
        if (member.image.startsWith('data:image')) {
           (memberWithoutImage as Partial<TeamMember>).image = 'https://placehold.co/128x128.png'; // Replace with placeholder on store
        }
        return memberWithoutImage;
      });
      window.localStorage.setItem('team', JSON.stringify(teamToStore));
    } catch (error) {
      console.warn('Error saving team to localStorage', error);
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
