
import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  entryTime?: string;
  description: string;
  imageUrl?: string; 
  imageHint?: string;
};

export type Facility = {
  name: string;
  description: string;
  image: string;
  imageHint: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageHint: string;
  createdAt: any;
};

export type HistoryItem = {
  year: string;
  description: string;
  image: string;
  imageHint: string;
};

export type RegisteredMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  dateOfJoining: string;
  createdAt: any;
};
